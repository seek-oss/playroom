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
import { KeyboardShortcut } from '../KeyboardShortcut/KeyboardShortcut';
import { Snippets } from '../Snippets/Snippets';
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
  const [{ hasSyntaxError, code, cursorPosition }] = useContext(StoreContext);
  const { runCommand } = useEditor();
  const hasSnippets = snippets && snippets.length > 0;

  const validCursorPosition = isValidLocation({
    code,
    cursor: cursorPosition,
  });

  return (
    <SharedTooltipContext>
      <div className={styles.root}>
        {hasSyntaxError ? (
          <div className={styles.syntaxErrorsContainer}>
            <Text tone="critical">
              Code has syntax errors. Fix them to use editor actions.
            </Text>
          </div>
        ) : (
          <>
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
            />
          </>
        )}
      </div>
    </SharedTooltipContext>
  );
};
