import CodeMirror, { Editor, Pos } from 'codemirror';
import { Selection } from './types';

interface TagRange {
  from: CodeMirror.Position;
  to: CodeMirror.Position;
  multiLine: boolean;
}

export const wrapInTag = (cm: Editor) => {
  const newSelections: Selection[] = [];
  const tagRanges: TagRange[] = [];

  let linesAdded = 0;

  for (const range of cm.listSelections()) {
    const from = range.from();
    const to = range.to();

    const isMultiLineSelection = to.line !== from.line;

    tagRanges.push({ from, to, multiLine: isMultiLineSelection });

    const newStartCursor = new Pos(from.line + linesAdded, from.ch + 1);
    const newEndCursor = isMultiLineSelection
      ? new Pos(to.line + linesAdded + 2, from.ch + 2)
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

        const closeTagIndentLevel = ' '.repeat(range.from.ch);

        cm.replaceRange(
          `<>\n${formattedExistingContent}\n${closeTagIndentLevel}</>`,
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
