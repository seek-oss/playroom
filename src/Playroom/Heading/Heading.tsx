import React, { ElementType, ReactNode } from 'react';
import classnames from 'classnames';

import * as styles from './Heading.css';

interface Props {
  level: '1' | '2' | '3';
  weight?: 'regular' | 'weak';
  as?: ElementType;
  children: ReactNode;
}

const resolveComponentFromLevel = (level: Props['level']) =>
  ({
    1: 'h1' as const,
    2: 'h2' as const,
    3: 'h3' as const,
  }[level]);

export const Heading = ({ as: component, level, weight, children }: Props) =>
  React.createElement(
    component || resolveComponentFromLevel(level),
    {
      className: classnames(styles.base, {
        [styles.level1]: level === '1',
        [styles.level2]: level === '2',
        [styles.level3]: level === '3',
        [styles.weak]: weight === 'weak',
      }),
    },
    children
  );
