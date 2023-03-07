import CodeMirror from 'codemirror';
import { Editor, Pos } from 'codemirror';
import { Direction, Selection } from './types';
type RangeMethod = Extract<keyof CodeMirror.Range, 'from' | 'to'>;

const directionToMethod: Record<Direction, RangeMethod> = {
  up: 'to',
  down: 'from',
};

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
  const newSelections: Selection[] = [];

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

export const swapLineUp = function (cm: Editor) {
  if (cm.isReadOnly()) {
    return CodeMirror.Pass;
  }

  // We need to keep track of the current bottom of the block
  // to make sure we're not overwriting lines
  let lastLine = cm.firstLine() - 1;

  const rangesToMove: Array<{ from: number; to: number }> = [];
  const newSels: Selection[] = [];

  for (const range of cm.listSelections()) {
    // Include one line above the current range
    const from = range.from().line - 1;
    let to = range.to().line;

    // Shift the selection up by one line
    newSels.push({
      anchor: new Pos(range.anchor.line - 1, range.anchor.ch),
      head: new Pos(range.head.line - 1, range.head.ch),
    });

    // If we've accidentally run over to the start of the
    // next line, then go back up one
    if (range.to().ch === 0 && !range.empty()) {
      --to;
    }

    // If the one-line-before-current-range is after the last line, put
    // the start and end lines in the list of lines to move
    if (from > lastLine) {
      rangesToMove.push({ from, to });
      // If the ranges overlap, update the last range in the list
      // to include both ranges
    } else if (rangesToMove.length) {
      rangesToMove[rangesToMove.length - 1].to = to;
    }

    // Move the last line to the end of the current range
    lastLine = to;
  }

  cm.operation(function () {
    for (const range of rangesToMove) {
      const { from, to } = range;
      const line = cm.getLine(from);
      cm.replaceRange('', new Pos(from, 0), new Pos(from + 1, 0), '+swapLine');

      if (to > cm.lastLine()) {
        cm.replaceRange(
          `\n${line}`,
          new Pos(cm.lastLine()),
          undefined,
          '+swapLine'
        );
      } else {
        cm.replaceRange(`${line}\n`, new Pos(to, 0), undefined, '+swapLine');
      }
    }

    cm.setSelections(newSels);
    cm.scrollIntoView(null);
  });
};

export const swapLineDown = function (cm: Editor) {
  if (cm.isReadOnly()) {
    return CodeMirror.Pass;
  }

  const ranges = cm.listSelections();
  const rangesToMove: Array<{ from: number; to: number }> = [];

  let firstLine = cm.lastLine() + 1;

  for (const range of [...ranges].reverse()) {
    let from = range.to().line + 1;
    const to = range.from().line;

    if (range.to().ch === 0 && !range.empty()) {
      from--;
    }

    if (from < firstLine) {
      rangesToMove.push({ from, to });
    } else if (rangesToMove.length) {
      rangesToMove[rangesToMove.length - 1].to = to;
    }

    firstLine = to;
  }

  cm.operation(function () {
    for (const range of rangesToMove) {
      const { from, to } = range;
      const line = cm.getLine(from);
      if (from === cm.lastLine()) {
        cm.replaceRange('', new Pos(from - 1), new Pos(from), '+swapLine');
      } else {
        cm.replaceRange(
          '',
          new Pos(from, 0),
          new Pos(from + 1, 0),
          '+swapLine'
        );
      }

      cm.replaceRange(`${line}\n`, new Pos(to, 0), undefined, '+swapLine');
    }
    cm.scrollIntoView(null);
  });
};
