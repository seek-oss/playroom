import type CodeMirror from 'codemirror';
import { type Editor, Pos } from 'codemirror';
import type { Selection } from './types';

const COMMENT_SYNTAX_OFFSET = '{/* '.length;

// Todo - find word for bookend in software
interface GetSelectionRangeOffsetCountOptions {
  pointType: 'anchor' | 'head';
  multiLine?: boolean;
  reverseSelection: boolean;
}

function getSelectionRangeOffsetCount({
  pointType,
  multiLine,
  reverseSelection,
}: GetSelectionRangeOffsetCountOptions): number {
  if (!multiLine) {
    return COMMENT_SYNTAX_OFFSET;
  }

  if (
    (pointType === 'head' && !reverseSelection) ||
    (pointType === 'anchor' && reverseSelection)
  ) {
    return 0;
  }

  return COMMENT_SYNTAX_OFFSET;
}

interface IsReverseSelectionOptions {
  from: CodeMirror.Position;
  to: CodeMirror.Position;
}

function isReverseSelection({ from, to }: IsReverseSelectionOptions): boolean {
  return from.line > to.line || (from.line === to.line && from.ch > to.ch);
}

interface TagRange {
  from: CodeMirror.Position;
  to: CodeMirror.Position;
  multiLine: boolean;
  existingIndent: number;
}

export const wrapInComment = (cm: Editor) => {
  const newSelections: Selection[] = [];
  const tagRanges: TagRange[] = [];

  for (const range of cm.listSelections()) {
    const from = range.from();
    let to = range.to();

    if (to.line !== from.line && to.ch === 0) {
      to = new Pos(to.line - 1);
    }

    const existingContent = cm.getRange(from, to);
    const existingIndent =
      existingContent.length - existingContent.trimStart().length;

    const isMultiLineSelection = to.line !== from.line;

    tagRanges.push({
      from,
      to,
      multiLine: isMultiLineSelection,
      existingIndent,
    });

    // Todo - change offset "+ 4" for prop comment
    const anchorOffset = getSelectionRangeOffsetCount({
      pointType: 'anchor',
      multiLine: isMultiLineSelection,
      reverseSelection: isReverseSelection({ from, to }),
    });

    const headOffset = getSelectionRangeOffsetCount({
      pointType: 'head',
      multiLine: isMultiLineSelection,
      reverseSelection: isReverseSelection({ from, to }),
    });

    const newSelectionRangeAnchor = new Pos(from.line, from.ch + anchorOffset);
    const newSelectionRangeHead = new Pos(to.line, to.ch + headOffset);

    newSelections.push({
      anchor: newSelectionRangeAnchor,
      head: newSelectionRangeHead,
    });

    if (from.ch < to.ch) {
      console.log('from.ch < to.ch');
    } else {
      console.log('from.ch >= to.ch');
    }

    // Todo - incorporate lines added
    // if (isMultiLineSelection) {
    //   linesAdded += 2;
    // }
  }

  cm.operation(() => {
    for (const range of [...tagRanges].reverse()) {
      // Todo - handle partial line selection
      // if (range.from.ch !== 0) {
      //   const newFrom = new Pos(range.from.line, 0);
      //   cm.replaceRange('/* ', newFrom, range.from);
      // } else {
      //   cm.replaceRange('/* ', range.from, range.from);
      // }

      const existingContent = cm.getRange(range.from, range.to);

      // const isMultiLineSelection = to.line !== from.line;

      cm.replaceRange(`{/* ${existingContent} */}`, range.from, range.to);
    }

    cm.setSelections(newSelections);
  });
};
