import type { ButtonHTMLAttributes } from 'react';

import { Text } from '../Text/Text';

import * as styles from './TextButton.css';

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  label: string;
};

export const TextButton = ({ label, ...restProps }: Props) => (
  <button type="button" className={styles.root} {...restProps}>
    <Text tone="secondary" size="small">
      {label}
    </Text>
  </button>
);
