import CodeMirror, { Editor, Pos } from 'codemirror';
import { Selection } from './types';

export const wrapInTag = (cm: Editor) => {
  const newSelections: Selection[] = [];
  const tagRanges: Array<Record<'from' | 'to', CodeMirror.Position>> = [];

  for (const range of cm.listSelections()) {
    const from = range.from();
    const to = range.to();

    tagRanges.push({ from, to });

    newSelections.push({
      anchor: new Pos(from.line, from.ch + 1),
      head: new Pos(from.line, from.ch + 1),
    });

    newSelections.push({
      anchor: new Pos(to.line, to.ch + 4),
      head: new Pos(to.line, to.ch + 4),
    });
  }

  cm.operation(() => {
    for (const range of tagRanges) {
      const existingContent = cm.getRange(range.from, range.to);
      cm.replaceRange(`<>${existingContent}</>`, range.from, range.to);
    }

    cm.setSelections(newSelections);
  });
};
