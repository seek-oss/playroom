import type CodeMirror from 'codemirror';
import { type Editor, Pos } from 'codemirror';
// import type { Selection } from './types';

interface TagRange {
  from: CodeMirror.Position;
  to: CodeMirror.Position;
  multiLine: boolean;
  existingIndent: number;
}

export const wrapInComment = (cm: Editor) => {
  const tagRanges: TagRange[] = [];

  // let linesAdded = 0;

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

    // Todo - incorporate lines added
    // if (isMultiLineSelection) {
    //   linesAdded += 2;
    // }
  }

  cm.operation(() => {
    for (const range of [...tagRanges].reverse()) {
      const existingContent = cm.getRange(range.from, range.to);

      // const isMultiLineSelection = to.line !== from.line;

      cm.replaceRange(`{/* ${existingContent} */}`, range.from, range.to);
    }
  });
};
