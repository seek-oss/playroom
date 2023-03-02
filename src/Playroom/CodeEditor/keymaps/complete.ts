import CodeMirror, { Editor } from 'codemirror';

export const completeAfter = (cm: Editor, predicate?: () => boolean) => {
  if (!predicate || predicate()) {
    setTimeout(() => {
      if (!cm.state.completionActive) {
        cm.showHint({ completeSingle: false });
      }
    }, 100);
  }

  return CodeMirror.Pass;
};

export const completeIfAfterLt = (cm: Editor) =>
  completeAfter(cm, () => {
    const cur = cm.getCursor();
    // eslint-disable-next-line new-cap
    return cm.getRange(CodeMirror.Pos(cur.line, cur.ch - 1), cur) === '<';
  });

export const completeIfInTag = (cm: Editor) =>
  completeAfter(cm, () => {
    const tok = cm.getTokenAt(cm.getCursor());
    if (
      tok.type === 'string' &&
      (!/['"]/.test(tok.string.charAt(tok.string.length - 1)) ||
        tok.string.length === 1)
    ) {
      return false;
    }
    const inner = CodeMirror.innerMode(cm.getMode(), tok.state).state;
    return inner.tagName;
  });
