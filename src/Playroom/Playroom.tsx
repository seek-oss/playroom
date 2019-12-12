import React, { useContext, ComponentType } from 'react';
import classnames from 'classnames';
import debounce from 'lodash/debounce';
import { Resizable } from 're-resizable';
import Preview from './Preview/Preview';
import WindowPortal from './WindowPortal';
import componentsToHints from '../utils/componentsToHints';
import DockPosition from './DockPosition/DockPosition';
import { StoreContext, EditorPosition } from '../StoreContext/StoreContext';

// @ts-ignore
import { CodeEditor } from './CodeEditor/CodeEditor';

// @ts-ignore
import styles from './Playroom.less';

const resizableConfig = (position: EditorPosition = 'bottom') => ({
  top: position === 'bottom',
  right: position === 'left',
  bottom: false,
  left: position === 'right',
  topRight: false,
  bottomRight: false,
  bottomLeft: false,
  topLeft: false
});

export interface PlayroomProps {
  themes: Record<string, any>;
  components: Record<string, ComponentType>;
  widths: number[];
}

export default ({ themes, components, widths }: PlayroomProps) => {
  const [
    { editorPosition, editorHeight, editorWidth, code, ready },
    dispatch
  ] = useContext(StoreContext);

  if (!ready) {
    return null;
  }

  const codeEditor = (
    <CodeEditor
      code={code}
      onChange={(newCode: string) =>
        dispatch({ type: 'updateCode', payload: { code: newCode } })
      }
      hints={componentsToHints(components)}
    />
  );

  const isVerticalEditor = /^(left|right)$/.test(editorPosition);
  const sizeStyles = {
    height: editorPosition === 'bottom' ? `${editorHeight}px` : '100vh', // issue in ff & safari when not a string
    width: isVerticalEditor ? `${editorWidth}px` : '100vw'
  };
  const editorContainer =
    editorPosition === 'undocked' ? (
      <WindowPortal
        height={window.outerHeight}
        width={window.outerWidth}
        onUnload={() => dispatch({ type: 'resetEditorPosition' })}
      >
        {codeEditor}
      </WindowPortal>
    ) : (
      <Resizable
        className={classnames(styles.editorContainer, {
          [styles.editorContainer_isRight]: editorPosition === 'right',
          [styles.editorContainer_isLeft]: editorPosition === 'left',
          [styles.editorContainer_isBottom]: editorPosition === 'bottom'
        })}
        defaultSize={sizeStyles}
        size={sizeStyles}
        onResize={(event, direction, ref) => {
          debounce(size => {
            dispatch({
              type: isVerticalEditor
                ? 'updateEditorWidth'
                : 'updateEditorHeight',
              payload: { size }
            });
          }, 1)(isVerticalEditor ? ref.offsetWidth : ref.offsetHeight);
        }}
        enable={resizableConfig(editorPosition)}
      >
        <div className={styles.dockPosition}>
          <DockPosition
            position={editorPosition}
            setPosition={(position: EditorPosition) =>
              dispatch({ type: 'updateEditorPosition', payload: { position } })
            }
          />
        </div>
        {codeEditor}
      </Resizable>
    );

  return (
    <div className={styles.root}>
      <div
        className={styles.previewContainer}
        style={
          editorPosition !== 'undocked'
            ? {
                [editorPosition]: isVerticalEditor ? editorWidth : editorHeight
              }
            : undefined
        }
      >
        <Preview code={code} themes={themes} widths={widths} />
      </div>
      {editorContainer}
    </div>
  );
};
