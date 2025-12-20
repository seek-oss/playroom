import clsx from 'clsx';
import React, { type ElementType, type ReactNode } from 'react';

import * as styles from './Text.css';

interface Props {
  size?: 'xsmall' | 'small' | 'standard' | 'large';
  weight?: 'regular' | 'strong';
  tone?: 'neutral' | 'secondary' | 'critical' | 'positive';
  as?: ElementType;
  align?: keyof typeof styles.align;
  truncate?: boolean;
  underline?: boolean;
  children: ReactNode;
}

const Truncate = ({ children }: { children: ReactNode }) => (
  <span className={styles.truncate}>{children}</span>
);

export const Text = ({
  as: component = 'span',
  size = 'standard',
  weight = 'regular',
  tone = 'neutral',
  truncate = false,
  underline = false,
  align,
  children,
}: Props) =>
  React.createElement(
    component,
    {
      className: clsx(styles.base, styles.size[size], styles[tone], {
        [styles.strong]: weight === 'strong',
        [styles.underline]: underline,
        [styles.align[align!]]: align,
      }),
    },
    truncate ? <Truncate>{children}</Truncate> : children
  );
