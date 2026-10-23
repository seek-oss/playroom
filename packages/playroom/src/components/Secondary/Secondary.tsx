import type { ReactNode } from 'react';

import * as styles from './Secondary.css';

interface Props {
  children: ReactNode;
}

export const Secondary = ({ children }: Props) => (
  <span className={styles.secondary}>{children}</span>
);
