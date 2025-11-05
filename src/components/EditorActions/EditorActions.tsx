import snippets from '__PLAYROOM_ALIAS__SNIPPETS__';
import {
  BetweenHorizontalStart,
  Ellipsis,
  type LucideIcon,
} from 'lucide-react';
import { useContext, useRef, type ButtonHTMLAttributes } from 'react';

import { useEditor } from '../../contexts/EditorContext';
import { StoreContext } from '../../contexts/StoreContext';
import { isValidLocation } from '../../utils/cursor';
import {
  type EditorCommand,
  editorCommandList,
  primaryMod,
} from '../CodeEditor/editorCommands';
import { editorErrorDelay } from '../CodeEditor/editorErrorDelay';
import { ErrorMessage } from '../EditorActions/EditorError';
import { Inline } from '../Inline/Inline';
import {
  KeyboardShortcut,
  type KeyCombination,
} from '../KeyboardShortcut/KeyboardShortcut';
import { Menu, MenuItem } from '../Menu/Menu';
import { Secondary } from '../Secondary/Secondary';
import { Snippets } from '../Snippets/Snippets';
import { Stack } from '../Stack/Stack';
import { SharedTooltipContext, Tooltip } from '../Tooltip/Tooltip';

import * as styles from './EditorActions.css';

interface EditorActionButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  name?: string;
  shortcut?: KeyCombination;
  icon: LucideIcon;
  disabledReason?: string;
  hideTooltip?: boolean;
}

const EditorActionButton = (props: EditorActionButtonProps) => {
  const {
    onClick,
    name,
    shortcut,
    icon: Icon,
    disabled,
    disabledReason,
    hideTooltip,
    ...restProps
  } = props;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <Tooltip
      label={
        disabled && disabledReason ? (
          disabledReason
        ) : (
          <Inline space="xxsmall" nowrap>
            <span>{name}</span>
            {shortcut ? (
              <Secondary>
                <KeyboardShortcut shortcut={shortcut} hideOnMobile={false} />
              </Secondary>
            ) : null}
          </Inline>
        )
      }
      trigger={
        <button
          {...restProps}
          onClick={handleClick}
          aria-disabled={disabled}
          className={styles.button}
          aria-label={name}
          style={hideTooltip ? { pointerEvents: 'none' } : undefined}
        >
          <Icon size={20} />
        </button>
      }
    />
  );
};

const menuSideOffset = 2;
const overflowCommands = editorCommandList.filter(
  ({ command }) => command !== 'formatCode' && command !== 'findPersistent'
);
const formatCommand = editorCommandList.find(
  ({ command }) => command === 'formatCode'
);
const searchCommand = editorCommandList.find(
  ({ command }) => command === 'findPersistent'
);
const syntaxErrorMessage = 'Code contains syntax errors.';

export const EditorActions = () => {
  const [
    { hasSyntaxError, syntaxErrorLineNumber, code, cursorPosition },
    dispatch,
  ] = useContext(StoreContext);
  const { runCommand } = useEditor();
  const hasSnippets = snippets && snippets.length > 0;
  const inputCommandRef = useRef<EditorCommand | null>(null);

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
          actionLabel={
            typeof syntaxErrorLineNumber === 'number'
              ? `Jump to line ${syntaxErrorLineNumber + 1}`
              : undefined
          }
        >
          {hasSyntaxError ? syntaxErrorMessage : null}
        </ErrorMessage>
        <div className={styles.root}>
          {hasSnippets ? (
            <Snippets
              sideOffset={menuSideOffset}
              trigger={(triggerProps) => (
                <EditorActionButton
                  {...triggerProps}
                  name="Insert snippet"
                  shortcut={[primaryMod, 'K']}
                  icon={BetweenHorizontalStart}
                  disabled={!validCursorPosition}
                  disabledReason="Can only insert between tags"
                  hideTooltip={hasSyntaxError}
                />
              )}
            />
          ) : null}
          {formatCommand ? (
            <EditorActionButton
              onClick={() => runCommand(formatCommand.command)}
              name={formatCommand.label}
              shortcut={formatCommand.shortcut}
              icon={formatCommand.icon}
              disabled={hasSyntaxError}
              disabledReason={syntaxErrorMessage}
              hideTooltip={hasSyntaxError}
            />
          ) : null}
          {searchCommand ? (
            <EditorActionButton
              onClick={() => runCommand(searchCommand.command)}
              name={searchCommand.label}
              shortcut={searchCommand.shortcut}
              icon={searchCommand.icon}
            />
          ) : null}
          <Menu
            onClose={() => {
              if (inputCommandRef.current) {
                runCommand(inputCommandRef.current);
                inputCommandRef.current = null;
              }
            }}
            trigger={<EditorActionButton name="More actions" icon={Ellipsis} />}
            width="content"
            side="top"
            sideOffset={menuSideOffset}
          >
            {overflowCommands.map(
              ({ command, label, shortcut, icon: Icon }) => (
                <MenuItem
                  key={command}
                  shortcut={shortcut}
                  onClick={() => {
                    inputCommandRef.current = command;
                  }}
                  icon={Icon}
                >
                  {label}
                </MenuItem>
              )
            )}
          </Menu>
        </div>
      </Stack>
    </SharedTooltipContext>
  );
};
