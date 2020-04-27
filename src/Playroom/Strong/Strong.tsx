import React, { ReactNode } from 'react';

// @ts-ignore
import styles from './Strong.less';

interface Props {
  children: ReactNode;
}

export const Strong = ({ children }: Props) => (
  <strong className={styles.strong}>{children}</strong>
);
