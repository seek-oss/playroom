import CodeMirror, { type Editor } from 'codemirror';

import { formatCode } from '../../../utils/formatting';

/** @ts-expect-error Register `formatCode` command */
CodeMirror.commands.formatCode = (cm: Editor) => {
  const { code: formattedCode, cursor: formattedCursor } = formatCode({
    code: cm.getValue(),
    cursor: cm.getCursor(),
  });

  cm.setValue(formattedCode);
  cm.setCursor(formattedCursor);
};
