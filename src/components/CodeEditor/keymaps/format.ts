import type { Editor } from 'codemirror';

import { formatCode as formatCodeUtil } from '../../../utils/formatting';

export const formatCode = (cm: Editor) => {
  const currentValue = cm.getValue();
  const { code: formattedCode, cursor: formattedCursor } = formatCodeUtil({
    code: currentValue,
    cursor: cm.getCursor(),
  });

  if (formattedCode !== currentValue) {
    cm.setValue(formattedCode);
    cm.setCursor(formattedCursor);
  }
};
