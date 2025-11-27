import { forwardRef, useState } from 'react';

import * as styles from './ChatField.css';

const pxToInt = (str: string | null) =>
  typeof str === 'string' ? parseInt(str.replace('px', ''), 10) : 0;

const calculateLines = (
  target: HTMLTextAreaElement,
  lines: number,
  lineLimit?: number
) => {
  const { paddingBottom, paddingTop, lineHeight } =
    window.getComputedStyle(target);

  // If line height is not a pixel value (e.g. 'normal' or unitless),
  // bail out of grow behaviour as we cannot calculate accurately.
  if (!lineHeight.endsWith('px')) {
    return lines;
  }

  const padding = pxToInt(paddingTop) + pxToInt(paddingBottom);
  const currentRows = Math.floor(
    (target.scrollHeight - padding) / pxToInt(lineHeight)
  );

  if (target && target.value === '') {
    return lines;
  }

  return typeof lineLimit === 'number' && currentRows > lineLimit
    ? lineLimit
    : currentRows;
};

interface Props {
  value: string;
  onChange: (ev: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
}

export const ChatField = forwardRef<HTMLTextAreaElement, Props>(
  ({ value, onChange, placeholder, rows = 2 }, ref) => {
    const [dynamicRows, setDynamicRows] = useState(rows);

    return (
      <textarea
        ref={ref}
        className={styles.textarea}
        value={value}
        rows={dynamicRows}
        onChange={(ev) => {
          setDynamicRows(calculateLines(ev.currentTarget, dynamicRows, 4));
          onChange(ev);
        }}
        placeholder={placeholder}
      />
    );
  }
);
