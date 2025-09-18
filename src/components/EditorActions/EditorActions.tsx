import snippets from '__PLAYROOM_ALIAS__SNIPPETS__';
import {
  BetweenHorizontalStart,
  BrushCleaningIcon,
  type LucideIcon,
} from 'lucide-react';
import { useContext, useRef } from 'react';

import { useEditor } from '../../contexts/EditorContext';
import { StoreContext } from '../../contexts/StoreContext';
import { Popover, type PopoverTrigger } from '../Popover/Popover';
import Snippets from '../Snippets/Snippets';
import { Text } from '../Text/Text';

import * as styles from './EditorActions.css';

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
  <button {...restProps} onClick={onClick} className={styles.button}>
    <Icon size={16} />
    <Text>{name}</Text>
    <Text tone="secondary">{shortcut}</Text>
  </button>
);

export const EditorActions = () => {
  const [{ snippetsOpen, hasSyntaxError }, dispatch] = useContext(StoreContext);
  const { runCommand } = useEditor();
  const searchRef = useRef<HTMLInputElement | null>(null);
  const hasSnippets = snippets && snippets.length > 0;

  return (
    <div className={styles.root}>
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
