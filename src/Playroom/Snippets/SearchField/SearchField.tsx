import type { AllHTMLAttributes } from 'react';

import * as styles from './SearchField.css';

type InputProps = AllHTMLAttributes<HTMLInputElement>;
interface Props {
  value: NonNullable<InputProps['value']>;
  onChange: NonNullable<InputProps['onChange']>;
  placeholder?: NonNullable<InputProps['placeholder']>;
  'aria-label'?: string;
  onBlur?: InputProps['onBlur'];
  onKeyUp?: InputProps['onKeyUp'];
  onKeyDown?: InputProps['onKeyDown'];
}

export default ({
  value,
  placeholder,
  'aria-label': ariaLabel,
  onChange,
  onBlur,
  onKeyUp,
  onKeyDown,
}: Props) => (
  <input
    type="search"
    placeholder={placeholder}
    aria-label={ariaLabel}
    autoFocus
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    onKeyUp={onKeyUp}
    onKeyDown={onKeyDown}
    className={styles.field}
  />
);
