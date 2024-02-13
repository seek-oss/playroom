import type CodeMirror from 'codemirror';
import { type Editor, Pos } from 'codemirror';
import type { Selection } from './types';

const BLOCK_COMMENT_OFFSET = '{/* '.length;
// const LINE_COMMENT_OFFSET = '// '.length;

interface IsReverseSelectionOptions {
  anchor: CodeMirror.Position;
  head: CodeMirror.Position;
}

function isReverseSelection({
  anchor,
  head,
}: IsReverseSelectionOptions): boolean {
  return (
    anchor.line > head.line ||
    (anchor.line === head.line && anchor.ch > head.ch)
  );
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

    // Todo - change offset from BLOCK_COMMENT_OFFSET to LINE_COMMENT_OFFSET for prop comment

    const toOffset = isMultiLineSelection ? 0 : BLOCK_COMMENT_OFFSET;

    const newSelectionRangeFrom = new Pos(
      from.line,
      from.ch + BLOCK_COMMENT_OFFSET
    );
    const newSelectionRangeTo = new Pos(to.line, to.ch + toOffset);

    const newSelection = isReverseSelection(range)
      ? { anchor: newSelectionRangeTo, head: newSelectionRangeFrom }
      : { anchor: newSelectionRangeFrom, head: newSelectionRangeTo };

    newSelections.push(newSelection);
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
