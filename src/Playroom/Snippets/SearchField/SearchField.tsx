import React, { AllHTMLAttributes } from 'react';

// @ts-ignore
import styles from './SearchField.less';

type InputProps = AllHTMLAttributes<HTMLInputElement>;
interface Props {
  value: NonNullable<InputProps['value']>;
  onChange: NonNullable<InputProps['onChange']>;
  placeholder?: NonNullable<InputProps['placeholder']>;
  onBlur?: InputProps['onBlur'];
  onKeyUp?: InputProps['onKeyUp'];
  onKeyDown?: InputProps['onKeyDown'];
  ['data-testid']?: string;
}

export default ({
  value,
  placeholder,
  onChange,
  onBlur,
  onKeyUp,
  onKeyDown,
  'data-testid': dataTestId,
}: Props) => (
  <input
    type="search"
    placeholder={placeholder}
    autoFocus
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    onKeyUp={onKeyUp}
    onKeyDown={onKeyDown}
    className={styles.field}
    data-testid={dataTestId}
  />
);
