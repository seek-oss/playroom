import { isMac } from '../../utils/formatting';

export type EditorCommand =
  | 'findPersistent'
  | 'replace'
  | 'toggleComment'
  | 'wrapInTag'
  | 'formatCode'
  | 'selectNextOccurrence'
  | 'jumpToLine'
  | 'swapLineUp'
  | 'swapLineDown'
  | 'duplicateLineUp'
  | 'duplicateLineDown'
  | 'addCursorToPrevLine'
  | 'addCursorToNextLine';

export interface EditorCommandMeta {
  command: EditorCommand;
  label: string;
  shortcut: string[];
}

const mac = isMac();

const primaryMod = mac ? 'Cmd' : 'Ctrl';

export const editorCommandList: EditorCommandMeta[] = [
  { command: 'findPersistent', label: 'Find', shortcut: [primaryMod, 'F'] },
  {
    command: 'replace',
    label: 'Find and replace',
    shortcut: [primaryMod, 'Alt', 'F'],
  },
  { command: 'formatCode', label: 'Tidy code', shortcut: [primaryMod, 'S'] },
  {
    command: 'toggleComment',
    label: 'Toggle comment',
    shortcut: [primaryMod, '/'],
  },
  {
    command: 'wrapInTag',
    label: 'Wrap selection in tag',
    shortcut: [primaryMod, 'Shift', ','],
  },
  {
    command: 'selectNextOccurrence',
    label: 'Select next occurrence',
    shortcut: [primaryMod, 'D'],
  },
  {
    command: 'jumpToLine',
    label: 'Jump to line number',
    shortcut: [primaryMod, 'G'],
  },
  {
    command: 'swapLineUp',
    label: 'Swap line up',
    shortcut: ['Alt', 'Up'],
  },
  {
    command: 'swapLineDown',
    label: 'Swap line down',
    shortcut: ['Alt', 'Down'],
  },
  {
    command: 'duplicateLineUp',
    label: 'Duplicate line up',
    shortcut: ['Shift', 'Alt', 'Up'],
  },
  {
    command: 'duplicateLineDown',
    label: 'Duplicate line down',
    shortcut: ['Shift', 'Alt', 'Down'],
  },
  {
    command: 'addCursorToPrevLine',
    label: 'Add cursor to prev line',
    shortcut: [primaryMod, 'Alt', 'Up'],
  },
  {
    command: 'addCursorToNextLine',
    label: 'Add cursor to next line',
    shortcut: [primaryMod, 'Alt', 'Down'],
  },
];
