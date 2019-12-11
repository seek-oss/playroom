import React from 'react';
import classnames from 'classnames';
import flatMap from 'lodash/flatMap';
import debounce from 'lodash/debounce';
import { Resizable } from 're-resizable';
import Preview from './Preview/Preview';
import styles from './Playroom.less';

import WindowPortal from './WindowPortal';
import componentsToHints from '../utils/componentsToHints';
import { CodeEditor } from './CodeEditor/CodeEditor';
import { useStore } from './useStore';
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
  const {
    editorPosition,
    setEditorPosition,
    editorSize,
    setEditorSize,
    code,
    setCode,
    ready
  } = useStore();

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
      onChange={setCode}
      hints={componentsToHints(components)}
    />
  );

  const size = {
    height: editorPosition === 'bottom' ? `${editorSize}px` : '100vh', // issue in ff & safari when not a string
    width: /(left|right)/.test(editorPosition) ? `${editorSize}px` : '100vw'
  };
  const editorContainer =
    editorPosition === 'undocked' ? (
      <WindowPortal
        height={window.outerHeight}
        width={window.outerWidth}
        onUnload={() => setEditorPosition()}
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
        defaultSize={size}
        size={size}
        onResize={(event, direction, ref) => {
          debounce(currentSize => {
            setEditorSize(currentSize, editorPosition);
          }, 1)(
            editorPosition === 'bottom' ? ref.offsetHeight : ref.offsetWidth
          );
        }}
        enable={resizableConfig(editorPosition)}
      >
        <div className={styles.dockPosition}>
          <DockPosition
            position={editorPosition}
            setPosition={setEditorPosition}
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
            ? { [editorPosition]: editorSize }
            : undefined
        }
      >
        <Preview code={code} themes={themes} frames={frames} />
      </div>
      {editorContainer}
    </div>
  );
};
