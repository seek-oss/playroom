import React, { useContext } from 'react';
import classnames from 'classnames';
import flatMap from 'lodash/flatMap';
import debounce from 'lodash/debounce';
import { Resizable } from 're-resizable';
import Preview from './Preview/Preview';
import styles from './Playroom.less';

import WindowPortal from './WindowPortal';
import componentsToHints from '../utils/componentsToHints';
import { CodeEditor } from './CodeEditor/CodeEditor';
import { StoreContext } from '../StoreContext/StoreContext';
import DockPosition from './DockPosition/DockPosition';

const resizableConfig = (position = 'bottom') => ({
  top: position === 'bottom',
  right: position === 'left',
  bottom: false,
  left: position === 'right',
  topRight: false,
  bottomRight: false,
  bottomLeft: false,
  topLeft: false
});

export default ({ themes, components, widths }) => {
  const [
    { editorPosition, editorHeight, editorWidth, code, ready },
    dispatch
  ] = useContext(StoreContext);

  if (!ready) {
    return null;
  }

  const themeNames = Object.keys(themes);
  const frames = flatMap(widths, width =>
    themeNames.map(theme => ({ theme, width }))
  );

  const codeEditor = (
    <CodeEditor
      code={code}
      onChange={newCode =>
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
          [styles.editorContainer_isUndocked]: editorPosition === 'undocked',
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
            setPosition={position =>
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
        <Preview code={code} themes={themes} frames={frames} />
      </div>
      {editorContainer}
    </div>
  );
};
