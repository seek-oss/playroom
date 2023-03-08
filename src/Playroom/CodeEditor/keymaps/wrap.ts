import CodeMirror, { Editor, Pos } from 'codemirror';
import { Selection } from './types';

export const wrapInTag = (cm: Editor) => {
  const newSelections: Selection[] = [];
  const tagRanges: Array<Record<'from' | 'to', CodeMirror.Position>> = [];

  for (const range of cm.listSelections()) {
    const from = range.from();
    const to = range.to();

    tagRanges.push({ from, to });

    const endCursorOffset = to.line === from.line ? 4 : 2;

    const newStartCursor = new Pos(from.line, from.ch + 1);
    const newEndCursor = new Pos(to.line, to.ch + endCursorOffset);

    newSelections.push({ anchor: newStartCursor, head: newStartCursor });
    newSelections.push({ anchor: newEndCursor, head: newEndCursor });
  }

  cm.operation(() => {
    for (const range of tagRanges) {
      const existingContent = cm.getRange(range.from, range.to);
      cm.replaceRange(`<>${existingContent}</>`, range.from, range.to);
    }

    cm.setSelections(newSelections);
  });
};
