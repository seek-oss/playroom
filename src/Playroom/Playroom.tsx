import React, { useContext, ComponentType, Fragment } from 'react';
import classnames from 'classnames';
import { useDebouncedCallback } from 'use-debounce';
import { Resizable } from 're-resizable';
import Preview from './Preview/Preview';
import WindowPortal from './WindowPortal';
import componentsToHints from '../utils/componentsToHints';
import Toolbar from './Toolbar/Toolbar';
import { StoreContext, EditorPosition } from '../StoreContext/StoreContext';

// @ts-ignore
import themeVars from '!!less-vars-loader?resolveVariables!./variables.less';

const getThemeVariable = (name: string) => {
  const resolvedVar = themeVars[name];

  if (!resolvedVar) {
    throw new Error(`Cannot resolve "${name}" from variables`);
  }

  if (!(typeof resolvedVar === 'string' && /(px|[0-9])$/.test(resolvedVar))) {
    throw new Error(
      `Invalid characters "${resolvedVar}", must be a number of pixel value`
    );
  }

  return parseInt(resolvedVar.replace(/px$/, ''), 10);
};

const MIN_HEIGHT =
  getThemeVariable('toolbar-item-size') *
  getThemeVariable('toolbar-max-item-count');
const MIN_WIDTH =
  getThemeVariable('toolbar-open-size') +
  getThemeVariable('toolbar-closed-size');

// @ts-ignore
import { CodeEditor } from './CodeEditor/CodeEditor';

// @ts-ignore
import styles from './Playroom.less';

const resizableConfig = (position: EditorPosition = 'bottom') => ({
  top: position === 'bottom',
  right: false,
  bottom: false,
  left: position === 'right',
  topRight: false,
  bottomRight: false,
  bottomLeft: false,
  topLeft: false
});

export interface PlayroomProps {
  components: Record<string, ComponentType>;
  themes: string[];
  widths: number[];
}

export default ({ components, themes, widths }: PlayroomProps) => {
  const [
    {
      editorPosition,
      editorHeight,
      editorWidth,
      visibleThemes,
      visibleWidths,
      code,
      ready
    },
    dispatch
  ] = useContext(StoreContext);

  const [updateEditorSize] = useDebouncedCallback(
    ({
      isVerticalEditor,
      offsetWidth,
      offsetHeight
    }: {
      isVerticalEditor: boolean;
      offsetHeight: number;
      offsetWidth: number;
    }) => {
      dispatch({
        type: isVerticalEditor ? 'updateEditorWidth' : 'updateEditorHeight',
        payload: { size: isVerticalEditor ? offsetWidth : offsetHeight }
      });
    },
    1
  );

  const [resetEditorPosition] = useDebouncedCallback(() => {
    if (editorPosition === 'undocked') {
      dispatch({ type: 'resetEditorPosition' });
    }
  }, 1);

  if (!ready) {
    return null;
  }

  const codeEditor = (
    <Fragment>
      <div className={styles.editorContainer}>
        <CodeEditor
          code={code}
          onChange={(newCode: string) =>
            dispatch({ type: 'updateCode', payload: { code: newCode } })
          }
          hints={componentsToHints(components)}
        />
      </div>
      <div className={styles.toolbarContainer}>
        <Toolbar widths={widths} themes={themes} />
      </div>
    </Fragment>
  );

  const isVerticalEditor = editorPosition === 'right';
  const isHorizontalEditor = editorPosition === 'bottom';
  const sizeStyles = {
    height: isHorizontalEditor ? `${editorHeight}px` : 'auto', // issue in ff & safari when not a string
    width: isVerticalEditor ? `${editorWidth}px` : 'auto'
  };
  const editorContainer =
    editorPosition === 'undocked' ? (
      <WindowPortal
        height={window.outerHeight}
        width={window.outerWidth}
        onUnload={resetEditorPosition}
        onError={resetEditorPosition}
      >
        {codeEditor}
      </WindowPortal>
    ) : (
      <Resizable
        className={classnames(styles.resizeableContainer, {
          [styles.resizeableContainer_isRight]: isVerticalEditor,
          [styles.resizeableContainer_isBottom]: isHorizontalEditor
        })}
        defaultSize={sizeStyles}
        size={sizeStyles}
        minWidth={MIN_WIDTH}
        minHeight={MIN_HEIGHT}
        onResize={(_event, _direction, { offsetWidth, offsetHeight }) => {
          updateEditorSize({ isVerticalEditor, offsetWidth, offsetHeight });
        }}
        enable={resizableConfig(editorPosition)}
      >
        {codeEditor}
      </Resizable>
    );

  return (
    <div className={styles.root}>
      <div
        className={styles.previewContainer}
        style={
          {
            right: { right: editorWidth },
            bottom: { bottom: editorHeight },
            undocked: undefined
          }[editorPosition]
        }
      >
        <Preview
          code={code}
          themes={
            visibleThemes && visibleThemes.length > 0 ? visibleThemes : themes
          }
          widths={
            visibleWidths && visibleWidths.length > 0 ? visibleWidths : widths
          }
        />
      </div>
      {editorContainer}
    </div>
  );
};
