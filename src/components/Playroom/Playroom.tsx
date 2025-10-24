import { assignInlineVars } from '@vanilla-extract/dynamic';
import clsx from 'clsx';
import { CodeXml, PanelBottomClose, PanelLeftClose } from 'lucide-react';
import {
  type ComponentProps,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  type EditorOrientation,
  StoreContext,
} from '../../contexts/StoreContext';
import { useDocumentTitle } from '../../utils/useDocumentTitle';
import { Box } from '../Box/Box';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { CodeEditor } from '../CodeEditor/CodeEditor';
import { EditorActions } from '../EditorActions/EditorActions';
import { EditorErrorMessage } from '../EditorErrorMessage/EditorErrorMessage';
import Frames from '../Frames/Frames';
import { Header } from '../Header/Header';
import { ZeroState } from '../ZeroState/ZeroState';

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
    {
      editorOrientation,
      editorHeight,
      editorWidth,
      panelsVisible,
      editorHidden,
      code,
      previewRenderCode,
      previewEditorCode,
      title,
      id,
      storedPlayrooms,
    },
    dispatch,
  ] = useContext(StoreContext);
  useDocumentTitle({ title });

  const lastHidden = useRef(editorHidden);
  const hideActionSource = useRef<'editor' | null>(null);
  const editorRef = useRef<HTMLElement | null>(null);
  const showCodeButtonRef = useRef<HTMLButtonElement | null>(null);
  const hideCodeButtonRef = useRef<HTMLButtonElement | null>(null);
  const [resizing, setResizing] = useState(false);

  const isVerticalEditor = editorOrientation === 'vertical';
  const editorSize = isVerticalEditor ? editorWidth : editorHeight;
  const editorVisible = panelsVisible && !editorHidden;
  const hasNoStoredPlayrooms = Object.entries(storedPlayrooms).length === 0;

  useEffect(() => {
    if (
      lastHidden.current !== editorHidden &&
      hideActionSource.current === 'editor'
    ) {
      if (editorHidden) {
        showCodeButtonRef.current?.focus();
      } else {
        hideCodeButtonRef.current?.focus();
      }

      hideActionSource.current = null;
    }
    lastHidden.current = editorHidden;
  }, [editorHidden]);

  return (
    <Box
      component="main"
      className={{
        [styles.root]: true,
        [styles.resizing]: resizing,
        [styles.editorOrientation[editorOrientation]]: true,
      }}
      style={assignInlineVars({
        [styles.editorSize]: editorVisible ? editorSize : undefined,
      })}
    >
      <Box className={styles.header}>
        <Header />
      </Box>

      <Box position="relative" className={styles.frames}>
        <Box className={styles.framesContainer}>
          {hasNoStoredPlayrooms || id || previewEditorCode ? (
            <Frames code={previewRenderCode || code} />
          ) : (
            <ZeroState />
          )}
        </Box>
        {panelsVisible && editorHidden ? (
          <aside className={styles.showCodeContainer}>
            <ButtonIcon
              label="Show code"
              icon={<CodeXml />}
              variant="solid"
              ref={showCodeButtonRef}
              onClick={() => {
                hideActionSource.current = 'editor';
                dispatch({ type: 'showEditor' });
              }}
            />
          </aside>
        ) : null}
      </Box>

      <Box
        position="relative"
        className={styles.editor}
        inert={!editorVisible}
        opacity={!editorVisible ? 0 : undefined}
        pointerEvents={!editorVisible ? 'none' : undefined}
        ref={editorRef}
      >
        <ResizeHandle
          ref={editorRef}
          position={resizeHandlePosition[editorOrientation]}
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
        <div className={styles.editorContainer}>
          <CodeEditor
            code={code}
            editorHidden={editorHidden}
            onChange={(newCode: string) =>
              dispatch({ type: 'updateCode', payload: { code: newCode } })
            }
            previewCode={previewEditorCode}
          />
          <aside
            className={clsx({
              [styles.hideCodeContainer]: true,
              [styles.hideCodeContainerHorizontal]:
                editorOrientation === 'horizontal',
              [styles.hideCodeContainerVertical]:
                editorOrientation === 'vertical',
            })}
          >
            <ButtonIcon
              icon={
                editorOrientation === 'horizontal' ? (
                  <PanelBottomClose />
                ) : (
                  <PanelLeftClose />
                )
              }
              label="Hide code"
              variant="transparent"
              ref={hideCodeButtonRef}
              onClick={() => {
                hideActionSource.current = 'editor';
                dispatch({ type: 'hideEditor' });
              }}
            />
          </aside>
          <div className={styles.editorOverlays}>
            <EditorErrorMessage />
            <EditorActions />
          </div>
        </div>
      </Box>
    </Box>
  );
};
