import { assignInlineVars } from '@vanilla-extract/dynamic';
import {
  type ComponentProps,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { StoreContext, type EditorPosition } from '../../contexts/StoreContext';
import { useDocumentTitle } from '../../utils/useDocumentTitle';
import { Box } from '../Box/Box';
import { CodeEditor } from '../CodeEditor/CodeEditor';
import Frames from '../Frames/Frames';
import { Header } from '../Header/Header';
import { StatusMessage } from '../StatusMessage/StatusMessage';
import { ANIMATION_DURATION_SLOW } from '../constants';

import { ResizeHandle } from './ResizeHandle';

import * as styles from './Playroom.css';

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

  useDocumentTitle({ title });

  const editorRef = useRef<HTMLElement | null>(null);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const [resizing, setResizing] = useState(false);
  const [lastEditorHidden, setLastEditorHidden] = useState(editorHidden);

  useEffect(() => {
    transitionTimeoutRef.current = setTimeout(
      () => setLastEditorHidden(editorHidden),
      ANIMATION_DURATION_SLOW
    );

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
    };
  }, [editorHidden]);

  const isVerticalEditor = editorPosition === 'right';
  const editorSize = isVerticalEditor ? editorWidth : editorHeight;

  return !ready ? null : (
    <Box
      component="main"
      className={{
        [styles.root]: true,
        [styles.resizing]: resizing,
        [styles.editorPosition[editorPosition]]: true,
        [styles.editorTransition]: lastEditorHidden !== editorHidden,
      }}
      style={assignInlineVars({
        [styles.editorSize]: editorHidden ? undefined : editorSize,
      })}
    >
      <Box className={styles.header}>
        <Header />
      </Box>

      <Box position="relative" className={styles.frames}>
        <Box className={styles.framesContainer}>
          <Frames code={previewRenderCode || code} />
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
        </div>
      </Box>
    </Box>
  );
};
