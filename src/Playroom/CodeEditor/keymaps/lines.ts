import CodeMirror from 'codemirror';
import { Editor, Pos } from 'codemirror';
import { Direction } from './types';
type RangeMethod = Extract<keyof CodeMirror.Range, 'from' | 'to'>;

const directionToMethod: Record<Direction, RangeMethod> = {
  up: 'to',
  down: 'from',
};

type Selections = Parameters<Editor['setSelections']>[0];
type ContentUpdate = [string, [CodeMirror.Position, CodeMirror.Position?]];

const getNewPosition = (
  range: CodeMirror.Range,
  direction: Direction,
  extraLines: number
) => {
  const currentLine = range[directionToMethod[direction]]().line;

  const newLine = direction === 'up' ? currentLine + 1 : currentLine;
  return new Pos(newLine + extraLines, 0);
};

const moveByLines = (range: CodeMirror.Range, lines: number) => {
  const anchor = new Pos(range.anchor.line + lines, range.anchor.ch);
  const head = new Pos(range.head.line + lines, range.head.ch);

  return { anchor, head };
};

export const duplicateLine = (direction: Direction) => (cm: Editor) => {
  const ranges = cm.listSelections();

  const contentUpdates: ContentUpdate[] = [];
  const newSelections: Selections = [];

  // To keep the selections in the right spot, we need to track how many additional
  // lines have been introduced to the document (in multicursor mode).
  let newLinesSoFar = 0;

  for (const range of ranges) {
    const newLineCount = range.to().line - range.from().line + 1;
    const existingContent = cm.getRange(
      new Pos(range.from().line, 0),
      new Pos(range.to().line)
    );

    const newContentParts = [existingContent, '\n'];

    // Copy up on the last line has some unusual behaviour
    if (range.to().line === cm.lastLine() && direction === 'up') {
      newContentParts.reverse();
    }

    const newContent = newContentParts.join('');

    contentUpdates.push([
      newContent,
      [getNewPosition(range, direction, newLinesSoFar)],
    ]);

    // Copy up doesn't always handle its cursors correctly
    if (direction === 'up') {
      newSelections.push(moveByLines(range, newLinesSoFar));
    }

    newLinesSoFar += newLineCount;
  }

  cm.operation(function () {
    for (const [newContent, [start, end]] of contentUpdates) {
      cm.replaceRange(newContent, start, end, '+swapLine');
    }

    // Shift the selection up by one line to match the moved content
    cm.setSelections(newSelections);
  });
};

export const swapLineUp = (cm: Editor) => {
  if (cm.isReadOnly()) {
    return CodeMirror.Pass;
  }

  const ranges = cm.listSelections();

  const contentUpdates: ContentUpdate[] = [];
  const newSelections: Selections = [];

  for (const range of ranges) {
    // If we're already at the top, do nothing
    if (range.from().line > 0) {
      const switchLineNumber = range.from().line - 1;
      const switchLineContent = cm.getLine(switchLineNumber);

      // Expand to the end of the selected lines
      const rangeStart = new Pos(range.from().line, 0);
      const rangeEnd = new Pos(range.to().line, undefined);

      const rangeContent = cm.getRange(rangeStart, rangeEnd);

      // Switch the order of the range and the preceding line
      const newContent = [rangeContent, switchLineContent].join('\n');

      contentUpdates.push([
        newContent,
        [new Pos(switchLineNumber, 0), rangeEnd],
      ]);

      newSelections.push({
        anchor: new Pos(range.anchor.line - 1, range.anchor.ch),
        head: new Pos(range.head.line - 1, range.head.ch),
      });
    }
  }

  cm.operation(() => {
    for (const [newContent, [start, end]] of contentUpdates) {
      cm.replaceRange(newContent, start, end, '+swapLine');
    }

    // Shift the selection up by one line to match the moved content
    cm.setSelections(newSelections);
  });
};

export const swapLineDown = (cm: Editor) => {
  if (cm.isReadOnly()) {
    return CodeMirror.Pass;
  }

  const ranges = cm.listSelections();

  const contentUpdates: ContentUpdate[] = [];
  const newSelections: Selections = [];

  for (const range of ranges.reverse()) {
    // If we're already at the bottom, do nothing
    if (range.to().line < cm.lastLine()) {
      const switchLineNumber = range.to().line + 1;
      const switchLineContent = cm.getLine(switchLineNumber);

      // Expand to the end of the selected lines
      const rangeStart = new Pos(range.from().line, 0);
      const rangeEnd = new Pos(range.to().line, undefined);

      const rangeContent = cm.getRange(rangeStart, rangeEnd);

      // Switch the order of the range and the preceding line
      const newContent = [switchLineContent, rangeContent].join('\n');

      contentUpdates.push([
        newContent,
        [rangeStart, new Pos(switchLineNumber)],
      ]);

      newSelections.push({
        anchor: new Pos(range.anchor.line + 1, range.anchor.ch),
        head: new Pos(range.head.line + 1, range.head.ch),
      });
    } else {
      // If we have reached the bottom, just preserve that cursor
      newSelections.push({
        anchor: new Pos(range.anchor.line, range.anchor.ch),
        head: new Pos(range.head.line, range.head.ch),
      });
    }
  }

  cm.operation(() => {
    for (const [newContent, [start, end]] of contentUpdates) {
      cm.replaceRange(newContent, start, end, '+swapLine');
    }

    // Shift the selection up by one line to match the moved content
    cm.setSelections(newSelections);
  });
};
