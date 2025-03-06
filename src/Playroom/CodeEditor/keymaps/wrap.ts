import { type Editor, Pos } from 'codemirror';
import type { Selection } from './types';

interface TagRange {
  from: CodeMirror.Position;
  to: CodeMirror.Position;
  multiLine: boolean;
  existingIndent: number;
}

export const wrapInTag = (cm: Editor) => {
  const newSelections: Selection[] = [];
  const tagRanges: TagRange[] = [];

  let linesAdded = 0;

  for (const range of cm.listSelections()) {
    const from = range.from();
    let to = range.to();

    const isMultiLineSelection = to.line !== from.line;

    if (to.line !== from.line && to.ch === 0) {
      to = new Pos(to.line - 1);
    }

    const existingContent = cm.getRange(from, to);
    const existingIndent =
      existingContent.length - existingContent.trimStart().length;

    tagRanges.push({
      from,
      to,
      multiLine: isMultiLineSelection,
      existingIndent,
    });

    const startCursorCharacterPosition =
      from.ch + 1 + (isMultiLineSelection ? existingIndent : 0);
    const newStartCursor = new Pos(
      from.line + linesAdded,
      startCursorCharacterPosition
    );

    const newEndCursor = isMultiLineSelection
      ? new Pos(to.line + linesAdded + 2, from.ch + existingIndent + 2)
      : new Pos(to.line + linesAdded, to.ch + 4);

    if (isMultiLineSelection) {
      linesAdded += 2;
    }

    newSelections.push({ anchor: newStartCursor, head: newStartCursor });
    newSelections.push({ anchor: newEndCursor, head: newEndCursor });
  }

  cm.operation(() => {
    for (const range of [...tagRanges].reverse()) {
      const existingContent = cm.getRange(range.from, range.to);

      if (range.multiLine) {
        const formattedExistingContent = existingContent
          .split('\n')
          .map((line, idx) => {
            const indentLevel = ' '.repeat((idx === 0 ? range.from.ch : 0) + 2);
            return `${indentLevel}${line}`;
          })
          .join('\n');

        const openTagIndentLevel = ' '.repeat(range.existingIndent);
        const closeTagIndentLevel = ' '.repeat(
          range.from.ch + range.existingIndent
        );

        cm.replaceRange(
          `${openTagIndentLevel}<>\n${formattedExistingContent}\n${closeTagIndentLevel}</>`,
          range.from,
          range.to
        );
      } else {
        cm.replaceRange(`<>${existingContent}</>`, range.from, range.to);
      }
    }

    cm.setSelections(newSelections);
  });
};
