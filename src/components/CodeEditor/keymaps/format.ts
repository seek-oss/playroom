import type { Editor } from 'codemirror';

import { formatCode as formatCodeUtil } from '../../../utils/formatting';

export const formatCode = (cm: Editor) => {
  const { code: formattedCode, cursor: formattedCursor } = formatCodeUtil({
    code: cm.getValue(),
    cursor: cm.getCursor(),
  });

  cm.setValue(formattedCode);
  cm.setCursor(formattedCursor);
};
