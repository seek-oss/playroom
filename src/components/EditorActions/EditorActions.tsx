import snippets from '__PLAYROOM_ALIAS__SNIPPETS__';
import {
  BetweenHorizontalStart,
  BrushCleaningIcon,
  type LucideIcon,
} from 'lucide-react';
import { useContext, type ButtonHTMLAttributes } from 'react';

import { useEditor } from '../../contexts/EditorContext';
import { StoreContext } from '../../contexts/StoreContext';
import { primaryMod } from '../CodeEditor/editorCommands';
import {
  KeyboardShortcut,
  type KeyCombination,
} from '../KeyboardShortcut/KeyboardShortcut';
import { Snippets } from '../Snippets/Snippets';
import { Text } from '../Text/Text';

import * as styles from './EditorActions.css';

interface EditorActionButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  shortcut: KeyCombination;
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
    <Text tone="secondary">
      <KeyboardShortcut shortcut={shortcut} />
    </Text>
  </button>
);

export const EditorActions = () => {
  const [{ hasSyntaxError }] = useContext(StoreContext);
  const { runCommand } = useEditor();
  const hasSnippets = snippets && snippets.length > 0;

  return (
    <div className={styles.root}>
      {hasSyntaxError ? (
        <div className={styles.syntaxErrorsContainer}>
          <Text>Code has syntax errors. Fix them to use editor actions.</Text>
        </div>
      ) : (
        <>
          {hasSnippets ? (
            <Snippets
              trigger={(triggerProps) => (
                <EditorActionButton
                  {...triggerProps}
                  name="Insert snippet"
                  shortcut={[primaryMod, 'K']}
                  icon={BetweenHorizontalStart}
                />
              )}
            />
          ) : null}
          <EditorActionButton
            onClick={() => runCommand('formatCode')}
            name="Tidy"
            shortcut={[primaryMod, 'S']}
            icon={BrushCleaningIcon}
          />
        </>
      )}
    </div>
  );
};
