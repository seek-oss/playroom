import { Popover as BaseUIPopover } from '@base-ui-components/react/popover';
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

import type { Snippet as SnippetType } from '../../../utils';
import { useEditor } from '../../contexts/EditorContext';
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
import Snippets from '../Snippets/Snippets';
import { StatusMessage } from '../StatusMessage/StatusMessage';
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

interface EditorActionButtonProps
  extends ComponentProps<typeof BaseUIPopover.Trigger> {
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

interface InsertSnippetPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (snippet: SnippetType | null) => void;
  trigger?: ComponentProps<typeof BaseUIPopover.Trigger>['render'];
}

const SnippetPopover = ({
  open,
  onOpenChange,
  onSelect,
  trigger,
}: InsertSnippetPopoverProps) => {
  const searchRef = useRef<HTMLInputElement | null>(null);

  return (
    <BaseUIPopover.Root open={open} onOpenChange={onOpenChange}>
      <BaseUIPopover.Trigger render={trigger} />
      <BaseUIPopover.Portal>
        <BaseUIPopover.Positioner
          side="top"
          sideOffset={10 /* Align with Menu -> SubMenu offset */}
        >
          <BaseUIPopover.Popup
            className={styles.snippetsPopup}
            initialFocus={searchRef}
          >
            <Snippets searchRef={searchRef} onSelect={onSelect} />
          </BaseUIPopover.Popup>
        </BaseUIPopover.Positioner>
      </BaseUIPopover.Portal>
    </BaseUIPopover.Root>
  );
};

export default () => {
  const [
    {
      editorHidden,
      code,
      previewRenderCode,
      previewEditorCode,
      title,
      snippetsOpen,
    },
    dispatch,
  ] = useContext(StoreContext);
  useDocumentTitle({ title });

  const { runCommand } = useEditor();
  const { editorOrientation, editorHeight, editorWidth, setEditorSize } =
    usePreferences();
  const editorRef = useRef<HTMLElement | null>(null);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const [resizing, setResizing] = useState(false);
  const [lastEditorHidden, setLastEditorHidden] = useState(editorHidden);

  const hasSnippets = snippets && snippets.length > 0;

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

          {/* Todo - fix when minimum width editor */}
          <Box className={styles.editorActions}>
            {hasSnippets && (
              <SnippetPopover
                open={snippetsOpen}
                onOpenChange={(open) =>
                  dispatch({ type: open ? 'openSnippets' : 'closeSnippets' })
                }
                onSelect={(snippet) => {
                  if (snippet) {
                    dispatch({ type: 'persistSnippet', payload: { snippet } });
                  } else {
                    dispatch({ type: 'closeSnippets' });
                  }
                }}
                trigger={
                  <EditorActionButton
                    name="Insert snippet"
                    shortcut="⌘K"
                    icon={BetweenHorizontalStart}
                  />
                }
              />
            )}
            <EditorActionButton
              onClick={() => runCommand('formatCode')}
              name="Tidy"
              shortcut="⌘S"
              icon={BrushCleaningIcon}
            />
          </Box>
        </div>
      </Box>
    </Box>
  );
};
