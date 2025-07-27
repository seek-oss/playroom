import clsx from 'clsx';
import React, { type ElementType, type ReactNode } from 'react';

import * as styles from './Heading.css';

interface Props {
  level: '1' | '2' | '3';
  as?: ElementType;
  children: ReactNode;
}

const resolveComponentFromLevel = (level: Props['level']) =>
  ({
    1: 'h1' as const,
    2: 'h2' as const,
    3: 'h3' as const,
  }[level]);

export const Heading = ({ as: component, level, children }: Props) =>
  React.createElement(
    component || resolveComponentFromLevel(level),
    {
      className: clsx(styles.base, {
        [styles.level1]: level === '1',
        [styles.level2]: level === '2',
        [styles.level3]: level === '3',
      }),
    },
    children
  );
