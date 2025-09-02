import { assignInlineVars } from '@vanilla-extract/dynamic';
import snippets from '__PLAYROOM_ALIAS__SNIPPETS__';
import {
  BetweenHorizontalStart,
  BrushCleaningIcon,
  type LucideIcon,
} from 'lucide-react';
import {
  type ComponentProps,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useEditor } from '../../contexts/EditorContext';
import {
  type EditorOrientation,
  StoreContext,
} from '../../contexts/StoreContext';
import { useDocumentTitle } from '../../utils/useDocumentTitle';
import { Box } from '../Box/Box';
import { CodeEditor } from '../CodeEditor/CodeEditor';
import { EditorErrorMessage } from '../EditorErrorMessage/EditorErrorMessage';
import Frames from '../Frames/Frames';
import { Header } from '../Header/Header';
import { Popover, type PopoverTrigger } from '../Popover/Popover';
import Snippets from '../Snippets/Snippets';
import { Text } from '../Text/Text';
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

interface EditorActionButtonProps extends PopoverTrigger {
  onClick?: () => void;
  name: string;
  shortcut: string;
  icon: LucideIcon;
}

const EditorActionButton = ({
  onClick,
  name,
  shortcut,
  icon: Icon,
  ...restProps
}: EditorActionButtonProps) => (
  <button
    {...restProps}
    onClick={onClick}
    className={styles.editorActionButton}
  >
    <Icon size={16} />
    <Text>{name}</Text>
    <Text tone="secondary">{shortcut}</Text>
  </button>
);

// Todo - fix when minimum width editor
const EditorActions = () => {
  const [{ snippetsOpen, hasSyntaxError }, dispatch] = useContext(StoreContext);
  const { runCommand } = useEditor();
  const searchRef = useRef<HTMLInputElement | null>(null);
  const hasSnippets = snippets && snippets.length > 0;

  return (
    <div className={styles.editorActions}>
      {hasSyntaxError ? (
        <Text>Code has syntax errors. Fix them to use editor actions.</Text>
      ) : (
        <>
          {hasSnippets ? (
            <Popover
              aria-label="Select a snippet"
              size="small"
              side="top"
              open={snippetsOpen}
              onOpenChange={(open) =>
                dispatch({ type: open ? 'openSnippets' : 'closeSnippets' })
              }
              trigger={
                <EditorActionButton
                  name="Insert snippet"
                  shortcut="⌘K"
                  icon={BetweenHorizontalStart}
                />
              }
              initialFocus={searchRef}
            >
              <div className={styles.snippetsPopupWidth}>
                <Snippets
                  searchRef={searchRef}
                  onSelect={(snippet) => {
                    if (snippet) {
                      dispatch({
                        type: 'persistSnippet',
                        payload: { snippet },
                      });
                    } else {
                      dispatch({ type: 'closeSnippets' });
                    }
                  }}
                />
              </div>
            </Popover>
          ) : null}
          <EditorActionButton
            onClick={() => runCommand('formatCode')}
            name="Tidy"
            shortcut="⌘S"
            icon={BrushCleaningIcon}
          />
        </>
      )}
    </div>
  );
};

export default () => {
  const [
    {
      editorOrientation,
      editorHeight,
      editorWidth,
      editorHidden,
      code,
      previewRenderCode,
      previewEditorCode,
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

  const isVerticalEditor = editorOrientation === 'vertical';
  const editorSize = isVerticalEditor ? editorWidth : editorHeight;

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
          <div className={styles.editorOverlays}>
            <EditorErrorMessage />
            <EditorActions />
          </div>
        </div>
      </Box>
    </Box>
  );
};
