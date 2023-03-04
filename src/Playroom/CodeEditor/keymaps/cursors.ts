import CodeMirror, { Editor, Pos } from 'codemirror';

import 'codemirror/addon/search/searchcursor';

import { Direction, Selection } from './types';

function wordAt(cm: Editor, pos: CodeMirror.Position) {
  let start = pos.ch;
  let end = start;
  const line = cm.getLine(pos.line);

  // Move `start` back to the beginning of the word
  while (start && CodeMirror.isWordChar(line.charAt(start - 1))) {
    --start;
  }

  // Move `end` to the end of the word
  while (end < line.length && CodeMirror.isWordChar(line.charAt(end))) {
    ++end;
  }

  return {
    from: new Pos(pos.line, start),
    to: new Pos(pos.line, end),
    word: line.slice(start, end),
  };
}

function rangeIsAlreadySelected(
  ranges: CodeMirror.Range[],
  checkRange: Pick<CodeMirror.Range, 'from' | 'to'>
) {
  for (const range of ranges) {
    const startsFromStart =
      CodeMirror.cmpPos(range.from(), checkRange.from()) === 0;
    const endsAtEnd = CodeMirror.cmpPos(range.to(), checkRange.to()) === 0;

    if (startsFromStart && endsAtEnd) {
      return true;
    }
  }

  return false;
}

export const selectNextOccurrence = (cm: Editor) => {
  const from = cm.getCursor('from');
  const to = cm.getCursor('to');

  // If the selections are the same as last time this
  // ran, we're still in full word mode
  let fullWord = cm.state.selectNextFindFullWord === cm.listSelections();

  // If this is just a cursor, rather than a selection
  if (CodeMirror.cmpPos(from, to) === 0) {
    const word = wordAt(cm, from);

    // And there's no actual word at that cursor, then do nothing
    if (!word.word) {
      return;
    }

    // Otherwise select the word and enter full word mode
    cm.setSelection(word.from, word.to);
    fullWord = true;
  } else {
    const text = cm.getRange(from, to);
    const query = fullWord ? new RegExp(`\\b${text}\\b`) : text;
    let cur = cm.getSearchCursor(query, to);
    let found = cur.findNext();

    // If we didn't find any occurrence in the rest of the
    // document, start again at the start
    if (!found) {
      cur = cm.getSearchCursor(query, new Pos(cm.firstLine(), 0));
      found = cur.findNext();
    }

    // If we still didn't find anything, or we re-discover a selection
    // we already have, then do nothing
    if (!found || rangeIsAlreadySelected(cm.listSelections(), cur)) {
      return;
    }

    cm.addSelection(cur.from(), cur.to());
  }

  if (fullWord) {
    cm.state.selectNextFindFullWord = cm.listSelections();
  }
};

function addCursorToSelection(cm: Editor, dir: Direction) {
  const ranges = cm.listSelections();
  const newRanges: Selection[] = [];

  const linesToMove = dir === 'up' ? -1 : 1;

  for (const range of ranges) {
    const newAnchor = cm.findPosV(range.anchor, linesToMove, 'line');
    const newHead = cm.findPosV(range.head, linesToMove, 'line');

    newRanges.push(range);
    newRanges.push({ anchor: newAnchor, head: newHead });
  }

  cm.setSelections(newRanges);
}

export const addCursorToPrevLine = (cm: Editor) =>
  addCursorToSelection(cm, 'up');
export const addCursorToNextLine = (cm: Editor) =>
  addCursorToSelection(cm, 'down');
