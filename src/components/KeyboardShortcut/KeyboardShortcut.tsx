import { isMac } from '../../utils/formatting';

import * as styles from './KeyboardShortcut.css';

export type KeyCombination = string[];
const mac = isMac();

const wordToSymbolMap: Record<string, string> = {
  Cmd: '⌘',
  Alt: '⌥',
  Shift: '⇧',
  Up: '↑',
  Down: '↓',
};

const convertShortcutForPlatform = (shortcut: KeyCombination) => {
  if (!mac) {
    return shortcut.join(' +  ');
  }

  return shortcut.map((key) => wordToSymbolMap[key] || key).join('');
};

export const KeyboardShortcut = ({ shortcut }: { shortcut: KeyCombination }) =>
  shortcut && (
    <span className={styles.shortcut}>
      {convertShortcutForPlatform(shortcut)}
    </span>
  );
