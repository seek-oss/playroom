import CodeMirror, { type Editor } from 'codemirror';

import { toggleComment } from './keymaps/comment';
import {
  addCursorToNextLine,
  addCursorToPrevLine,
  selectNextOccurrence,
} from './keymaps/cursors';
import { formatCode } from './keymaps/format';
import { duplicateLine, swapLineDown, swapLineUp } from './keymaps/lines';
import { wrapInTag } from './keymaps/wrap';

const customCommands: Record<string, (cm: Editor) => void> = {
  toggleComment,
  selectNextOccurrence,
  addCursorToPrevLine,
  addCursorToNextLine,
  formatCode,
  duplicateLineUp: duplicateLine('up'),
  duplicateLineDown: duplicateLine('down'),
  swapLineUp,
  swapLineDown,
  wrapInTag,
};

Object.entries(customCommands).forEach(([name, command]) => {
  /** @ts-expect-error Register custom command */
  CodeMirror.commands[name] = command;
});
