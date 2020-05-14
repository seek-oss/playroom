import React, { useContext, ComponentType, Fragment } from 'react';
import classnames from 'classnames';
import { useDebouncedCallback } from 'use-debounce';
import { Resizable } from 're-resizable';
import Frames from './Frames/Frames';
import WindowPortal from './WindowPortal';
import { Snippets } from '../../utils';
import componentsToHints from '../utils/componentsToHints';
import Toolbar from './Toolbar/Toolbar';
import ChevronIcon from './icons/ChevronIcon';
import { StatusMessage } from './StatusMessage/StatusMessage';
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
  getThemeVariable('toolbar-closed-size') +
  80;

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
  topLeft: false,
});

const resolveDirection = (
  editorPosition: EditorPosition,
  editorHidden: boolean
) => {
  if (editorPosition === 'right') {
    return editorHidden ? 'left' : 'right';
  }

  return editorHidden ? 'up' : 'down';
};

export interface PlayroomProps {
  components: Record<string, ComponentType>;
  themes: string[];
  widths: number[];
  snippets: Snippets;
}

export default ({ components, themes, widths, snippets }: PlayroomProps) => {
  const [
    {
      editorPosition,
      editorHeight,
      editorWidth,
      editorHidden,
      visibleThemes,
      visibleWidths,
      code,
      previewRenderCode,
      previewEditorCode,
      ready,
    },
    dispatch,
  ] = useContext(StoreContext);

  const [updateEditorSize] = useDebouncedCallback(
    ({
      isVerticalEditor,
      offsetWidth,
      offsetHeight,
    }: {
      isVerticalEditor: boolean;
      offsetHeight: number;
      offsetWidth: number;
    }) => {
      dispatch({
        type: isVerticalEditor ? 'updateEditorWidth' : 'updateEditorHeight',
        payload: { size: isVerticalEditor ? offsetWidth : offsetHeight },
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
          previewCode={previewEditorCode}
          hints={componentsToHints(components)}
        />
        <StatusMessage />
      </div>
      <div className={styles.toolbarContainer}>
        <Toolbar widths={widths} themes={themes} snippets={snippets} />
      </div>
    </Fragment>
  );

  const isVerticalEditor = editorPosition === 'right';
  const isHorizontalEditor = editorPosition === 'bottom';
  const sizeStyles = {
    height: isHorizontalEditor ? `${editorHeight}px` : 'auto', // issue in ff & safari when not a string
    width: isVerticalEditor ? `${editorWidth}px` : 'auto',
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
          [styles.resizeableContainer_isBottom]: isHorizontalEditor,
          [styles.resizeableContainer_isHidden]: editorHidden,
        })}
        defaultSize={sizeStyles}
        size={sizeStyles}
        minWidth={isVerticalEditor ? MIN_WIDTH : undefined}
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
          editorHidden
            ? undefined
            : {
                right: { right: editorWidth },
                bottom: { bottom: editorHeight },
                undocked: undefined,
              }[editorPosition]
        }
      >
        <Frames
          code={previewRenderCode || code}
          themes={
            visibleThemes && visibleThemes.length > 0 ? visibleThemes : themes
          }
          widths={
            visibleWidths && visibleWidths.length > 0 ? visibleWidths : widths
          }
        />
        <div
          className={classnames(styles.toggleEditorContainer, {
            [styles.isBottom]: isHorizontalEditor,
          })}
        >
          <button
            className={styles.toggleEditorButton}
            title={`${editorHidden ? 'Show' : 'Hide'} the editor`}
            onClick={() =>
              dispatch({ type: editorHidden ? 'showEditor' : 'hideEditor' })
            }
          >
            <ChevronIcon
              size={16}
              direction={resolveDirection(editorPosition, editorHidden)}
            />
          </button>
        </div>
      </div>
      {editorContainer}
    </div>
  );
};
