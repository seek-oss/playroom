import React, { ReactNode } from 'react';

import * as styles from './Strong.css';

interface Props {
  children: ReactNode;
}

export const Strong = ({ children }: Props) => (
  <strong className={styles.strong}>{children}</strong>
);
