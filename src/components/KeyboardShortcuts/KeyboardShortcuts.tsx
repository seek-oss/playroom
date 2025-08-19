import { isMac } from '../../utils/formatting';
import { Box } from '../Box/Box';
import { Inline } from '../Inline/Inline';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';

import * as styles from './KeyboardShortcuts.css';

const getKeyBindings = () => {
  const metaKeySymbol = isMac() ? '⌘' : 'Ctrl';
  const altKeySymbol = isMac() ? '⌥' : 'Alt';
  const shiftKeySymbol = isMac() ? '⇧' : 'Shift';

  return {
    Find: [metaKeySymbol, 'F'],
    'Find and replace': [metaKeySymbol, altKeySymbol, 'F'],
    'Toggle comment': [metaKeySymbol, '/'],
    'Wrap selection in tag': [metaKeySymbol, shiftKeySymbol, ','],
    'Format code': [metaKeySymbol, 'S'],
    'Insert snippet': [metaKeySymbol, 'K'],
    'Select next occurrence': [metaKeySymbol, 'D'],
    'Jump to line number': [metaKeySymbol, 'G'],
    'Swap line up': [altKeySymbol, '↑'],
    'Swap line down': [altKeySymbol, '↓'],
    'Duplicate line up': [shiftKeySymbol, altKeySymbol, '↑'],
    'Duplicate line down': [shiftKeySymbol, altKeySymbol, '↓'],
    'Add cursor to prev line': [metaKeySymbol, altKeySymbol, '↑'],
    'Add cursor to next line': [metaKeySymbol, altKeySymbol, '↓'],
  };
};
interface KeyboardShortcutProps {
  keybinding: string[];
  description: string;
}

const KeyboardShortcut = ({
  keybinding,
  description,
}: KeyboardShortcutProps) => {
  const shortcutSegments = keybinding.map((segment) => (
    <kbd className={styles.kbd} key={`${keybinding}-${segment}`}>
      {segment}
    </kbd>
  ));

  return (
    <Inline space="xsmall" alignY="center">
      <Box flexGrow={1}>
        <Text>{description}</Text>
      </Box>
      <Text size={isMac() ? 'large' : 'standard'}>
        <div className={styles.keyboardShortcutKeys}>{shortcutSegments}</div>
      </Text>
    </Inline>
  );
};
export const KeyboardShortcuts = () => {
  const keybindings = getKeyBindings();

  return (
    <Stack space="medium">
      {Object.entries(keybindings).map(([description, keybinding]) => (
        <KeyboardShortcut
          description={description}
          keybinding={keybinding}
          key={description}
        />
      ))}
    </Stack>
  );
};
