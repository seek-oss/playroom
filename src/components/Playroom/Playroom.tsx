import { assignInlineVars } from '@vanilla-extract/dynamic';
import { type ComponentProps, useContext, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';

import { StoreContext, type EditorPosition } from '../../contexts/StoreContext';
import { Box } from '../Box/Box';
import { CodeEditor } from '../CodeEditor/CodeEditor';
import Frames from '../Frames/Frames';
import { StatusMessage } from '../StatusMessage/StatusMessage';
import Toolbar from '../Toolbar/Toolbar';
import ChevronIcon from '../icons/ChevronIcon';

import { ResizeHandle } from './ResizeHandle';

import * as styles from './Playroom.css';

const resolveDirection = (
  editorPosition: EditorPosition,
  editorHidden: boolean
) => {
  if (editorPosition === 'right') {
    return editorHidden ? 'left' : 'right';
  }

  return editorHidden ? 'up' : 'down';
};

const getTitle = (title: string | undefined) => {
  if (title) {
    return `${title} | Playroom`;
  }

  const configTitle = window?.__playroomConfig__.title;

  if (configTitle) {
    return `${configTitle} | Playroom`;
  }

  return 'Playroom';
};

const resizeHandlePosition: Record<
  EditorPosition,
  ComponentProps<typeof ResizeHandle>['position']
> = {
  bottom: 'top',
  right: 'left',
} as const;

export default () => {
  const [
    {
      editorPosition,
      editorHeight,
      editorWidth,
      editorHidden,
      code,
      previewRenderCode,
      previewEditorCode,
      ready,
      title,
    },
    dispatch,
  ] = useContext(StoreContext);
  const [resizing, setResizing] = useState(false);
  const editorRef = useRef<HTMLElement | null>(null);

  if (!ready) {
    return null;
  }

  const isVerticalEditor = editorPosition === 'right';
  const editorSize = isVerticalEditor ? editorWidth : editorHeight;
  const displayedTitle = getTitle(title);

  return (
    <Box
      component="main"
      className={{
        [styles.root]: true,
        [styles.editorPosition[editorPosition]]: true,
        [styles.resizing]: resizing,
      }}
      style={assignInlineVars({
        [styles.editorSize]: editorHidden ? undefined : editorSize,
      })}
    >
      {title === undefined ? null : (
        <Helmet>
          <title>{displayedTitle}</title>
        </Helmet>
      )}

      <Box position="relative" className={styles.frames}>
        <Box className={styles.framesContainer}>
          <Frames code={previewRenderCode || code} />
        </Box>
        <Box className={styles.toggleEditorContainer}>
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
        </Box>
      </Box>

      <Box
        position="relative"
        className={styles.editor}
        inert={editorHidden}
        ref={editorRef}
      >
        <div className={styles.editorContainer}>
          <ResizeHandle
            ref={editorRef}
            position={resizeHandlePosition[editorPosition]}
            onResize={(newValue) => {
              dispatch({
                type: isVerticalEditor
                  ? 'updateEditorWidth'
                  : 'updateEditorHeight',
                payload: { size: newValue },
              });
            }}
            onResizeStart={() => setResizing(true)}
            onResizeEnd={(endValue) => {
              setResizing(false);
              dispatch({
                type: isVerticalEditor
                  ? 'updateEditorWidth'
                  : 'updateEditorHeight',
                payload: { size: endValue },
              });
            }}
          />
          <CodeEditor
            code={code}
            editorHidden={editorHidden}
            onChange={(newCode: string) =>
              dispatch({ type: 'updateCode', payload: { code: newCode } })
            }
            previewCode={previewEditorCode}
          />
          <StatusMessage />
          <div className={styles.toolbarContainer}>
            <Toolbar />
          </div>
        </div>
      </Box>
    </Box>
  );
};
