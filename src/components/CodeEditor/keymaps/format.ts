import type { Editor } from 'codemirror';

import { formatCode as formatCodeUtil } from '../../../utils/formatting';

export const formatCode = (cm: Editor) => {
  const currentValue = cm.getValue();
  const cursor = cm.getCursor();

  formatCodeUtil({ code: currentValue, cursor }).then(
    ({ code: formattedCode, cursor: formattedCursor }) => {
      if (formattedCode !== cm.getValue()) {
        cm.setValue(formattedCode);
        cm.setCursor(formattedCursor);
      }
    },
  );
};
