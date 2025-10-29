import snippets from '__PLAYROOM_ALIAS__SNIPPETS__';
import {
  BetweenHorizontalStart,
  BrushCleaningIcon,
  type LucideIcon,
} from 'lucide-react';
import { useContext, type ButtonHTMLAttributes, type ReactNode } from 'react';

import { useEditor } from '../../contexts/EditorContext';
import { StoreContext } from '../../contexts/StoreContext';
import { isValidLocation } from '../../utils/cursor';
import { primaryMod } from '../CodeEditor/editorCommands';
import { editorErrorDelay } from '../CodeEditor/editorErrorDelay';
import { ErrorMessage } from '../EditorActions/EditorError';
import { KeyboardShortcut } from '../KeyboardShortcut/KeyboardShortcut';
import { Snippets } from '../Snippets/Snippets';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';
import { SharedTooltipContext, Tooltip } from '../Tooltip/Tooltip';

import * as styles from './EditorActions.css';

interface EditorActionButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  label: ReactNode;
  icon: LucideIcon;
}

const EditorActionButton = (props: EditorActionButtonProps) => {
  const { onClick, name, label, icon: Icon, disabled, ...restProps } = props;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <Tooltip
      label={label}
      trigger={
        <button
          {...restProps}
          onClick={handleClick}
          aria-disabled={disabled}
          className={styles.button}
        >
          <Icon size={16} />
          <Text>{name}</Text>
        </button>
      }
    />
  );
};

export const EditorActions = () => {
  const [
    { hasSyntaxError, syntaxErrorLineNumber, code, cursorPosition },
    dispatch,
  ] = useContext(StoreContext);
  const { runCommand } = useEditor();
  const hasSnippets = snippets && snippets.length > 0;

  const validCursorPosition = isValidLocation({
    code,
    cursor: cursorPosition,
  });

  return (
    <SharedTooltipContext>
      <Stack space="small" align="center">
        <ErrorMessage
          delay={editorErrorDelay}
          action={
            typeof syntaxErrorLineNumber === 'number'
              ? () =>
                  dispatch({
                    type: 'updateCursorPosition',
                    payload: {
                      position: { line: syntaxErrorLineNumber, ch: 0 },
                    },
                  })
              : undefined
          }
          actionLabel="Jump to line"
        >
          {hasSyntaxError ? 'Code contains syntax errors.' : null}
        </ErrorMessage>
        <div
          className={styles.root}
          style={hasSyntaxError ? { pointerEvents: 'none' } : undefined}
        >
          {hasSnippets ? (
            <Snippets
              trigger={(triggerProps) => (
                <EditorActionButton
                  {...triggerProps}
                  name="Insert snippet"
                  label={
                    validCursorPosition ? (
                      <KeyboardShortcut
                        shortcut={[primaryMod, 'K']}
                        hideOnMobile={false}
                      />
                    ) : (
                      'Can only insert between tags'
                    )
                  }
                  icon={BetweenHorizontalStart}
                  disabled={!validCursorPosition}
                />
              )}
            />
          ) : null}
          <EditorActionButton
            onClick={() => runCommand('formatCode')}
            name="Tidy"
            label={
              <KeyboardShortcut
                shortcut={[primaryMod, 'S']}
                hideOnMobile={false}
              />
            }
            icon={BrushCleaningIcon}
            disabled={hasSyntaxError}
          />
        </div>
      </Stack>
    </SharedTooltipContext>
  );
};
