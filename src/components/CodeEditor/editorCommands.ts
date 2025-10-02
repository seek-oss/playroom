import {
  QuoteIcon,
  type LucideIcon,
  SearchIcon,
  CodeIcon,
  BrushCleaningIcon,
  ArrowRightLeftIcon,
  ListOrderedIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  SquareArrowUpIcon,
  SquareArrowDownIcon,
  ArrowUpFromLineIcon,
  ArrowDownFromLineIcon,
} from 'lucide-react';

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
  icon: LucideIcon;
}

const mac = isMac();

export const primaryMod = mac ? 'Cmd' : 'Ctrl';

export const editorCommandList: EditorCommandMeta[] = [
  {
    command: 'findPersistent',
    label: 'Find',
    shortcut: [primaryMod, 'F'],
    icon: SearchIcon,
  },
  {
    command: 'replace',
    label: 'Find and replace',
    shortcut: ['Alt', primaryMod, 'F'],
    icon: SearchIcon,
  },
  {
    command: 'formatCode',
    label: 'Tidy code',
    shortcut: [primaryMod, 'S'],
    icon: BrushCleaningIcon,
  },
  {
    command: 'toggleComment',
    label: 'Toggle comment',
    shortcut: [primaryMod, '/'],
    icon: QuoteIcon,
  },
  {
    command: 'wrapInTag',
    label: 'Wrap selection in tag',
    shortcut: ['Shift', primaryMod, ','],
    icon: CodeIcon,
  },
  {
    command: 'selectNextOccurrence',
    label: 'Select next occurrence',
    shortcut: [primaryMod, 'D'],
    icon: ArrowRightLeftIcon,
  },
  {
    command: 'jumpToLine',
    label: 'Jump to line number',
    shortcut: [primaryMod, 'G'],
    icon: ListOrderedIcon,
  },
  {
    command: 'swapLineUp',
    label: 'Swap line up',
    shortcut: ['Alt', 'Up'],
    icon: ArrowUpIcon,
  },
  {
    command: 'swapLineDown',
    label: 'Swap line down',
    shortcut: ['Alt', 'Down'],
    icon: ArrowDownIcon,
  },
  {
    command: 'duplicateLineUp',
    label: 'Duplicate line up',
    shortcut: ['Shift', 'Alt', 'Up'],
    icon: SquareArrowUpIcon,
  },
  {
    command: 'duplicateLineDown',
    label: 'Duplicate line down',
    shortcut: ['Shift', 'Alt', 'Down'],
    icon: SquareArrowDownIcon,
  },
  {
    command: 'addCursorToPrevLine',
    label: 'Add cursor to prev line',
    shortcut: ['Alt', primaryMod, 'Up'],
    icon: ArrowUpFromLineIcon,
  },
  {
    command: 'addCursorToNextLine',
    label: 'Add cursor to next line',
    shortcut: ['Alt', primaryMod, 'Down'],
    icon: ArrowDownFromLineIcon,
  },
];
