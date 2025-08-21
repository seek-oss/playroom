import { assignInlineVars } from '@vanilla-extract/dynamic';
import {
  type ComponentProps,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  usePreferences,
  type EditorOrientation,
} from '../../contexts/PreferencesContext';
import { StoreContext } from '../../contexts/StoreContext';
import { useDocumentTitle } from '../../utils/useDocumentTitle';
import { Box } from '../Box/Box';
import { CodeEditor } from '../CodeEditor/CodeEditor';
import Frames from '../Frames/Frames';
import { Header } from '../Header/Header';
import { StatusMessage } from '../StatusMessage/StatusMessage';
import { ANIMATION_DURATION_SLOW } from '../constants';

import { ResizeHandle } from './ResizeHandle';

import * as styles from './Playroom.css';

const resizeHandlePosition: Record<
  EditorOrientation,
  ComponentProps<typeof ResizeHandle>['position']
> = {
  horizontal: 'top',
  vertical: 'right',
} as const;

export default () => {
  const [
    { editorHidden, code, previewRenderCode, previewEditorCode, title },
    dispatch,
  ] = useContext(StoreContext);
  useDocumentTitle({ title });

  const { editorOrientation, editorHeight, editorWidth, setEditorSize } =
    usePreferences();
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

  const editorSize =
    editorOrientation === 'vertical' ? editorWidth : editorHeight;

  return (
    <Box
      component="main"
      className={{
        [styles.root]: true,
        [styles.resizing]: resizing,
        [styles.editorOrientation[editorOrientation]]: true,
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
            position={resizeHandlePosition[editorOrientation]}
            onResize={setEditorSize}
            onResizeStart={() => setResizing(true)}
            onResizeEnd={(endValue) => {
              setResizing(false);
              setEditorSize(endValue);
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
