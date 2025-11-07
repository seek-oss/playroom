import clsx from 'clsx';

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
    return shortcut.join('+');
  }

  return shortcut.map((key) => wordToSymbolMap[key] || key).join('');
};

export const KeyboardShortcut = ({
  shortcut,
  hideOnMobile = true,
}: {
  shortcut: KeyCombination;
  hideOnMobile?: boolean;
}) =>
  shortcut && (
    <span
      aria-hidden
      className={clsx({
        [styles.shortcut]: true,
        [styles.mac]: mac,
        [styles.win]: !mac,
        [styles.hideOnMobile]: hideOnMobile,
      })}
    >
      {convertShortcutForPlatform(shortcut)}
    </span>
  );
