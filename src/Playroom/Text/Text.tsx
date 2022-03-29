import React, { ElementType, ReactNode } from 'react';
import classnames from 'classnames';

import * as styles from './Text.css';

interface Props {
  size?: 'xsmall' | 'small' | 'standard' | 'large';
  weight?: 'regular' | 'strong';
  tone?: 'neutral' | 'critical';
  as?: ElementType;
  truncate?: boolean;
  children: ReactNode;
}

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
      className: classnames(styles.base, styles[size], styles[tone], {
        [styles.strong]: weight === 'strong',
        [styles.truncate]: truncate,
      }),
    },
    children
  );
