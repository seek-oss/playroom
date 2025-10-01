import clsx from 'clsx';
import React, { type ElementType, type ReactNode } from 'react';

import * as styles from './Text.css';

interface Props {
  size?: 'xsmall' | 'small' | 'standard' | 'large';
  weight?: 'regular' | 'strong';
  tone?: 'neutral' | 'secondary' | 'critical' | 'positive';
  as?: ElementType;
  truncate?: boolean;
  children: ReactNode;
}

export const Truncate = ({ children }: { children: ReactNode }) => (
  <span className={styles.truncate}>{children}</span>
);

export const Text = ({
  as: component = 'span',
  size = 'standard',
  weight = 'regular',
  tone = 'neutral',
  truncate = false,
  children,
}: Props) =>
  React.createElement(
    component,
    {
      className: clsx(styles.base, styles.size[size], styles[tone], {
        [styles.strong]: weight === 'strong',
      }),
    },
    truncate ? <Truncate>{children}</Truncate> : children
  );
