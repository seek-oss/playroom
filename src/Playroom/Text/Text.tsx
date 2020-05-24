import React, { ElementType, ReactNode } from 'react';
import classnames from 'classnames';

// @ts-ignore
import styles from './Text.less';

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
      className: classnames(styles.base, {
        [styles.xsmall]: size === 'xsmall',
        [styles.small]: size === 'small',
        [styles.standard]: size === 'standard',
        [styles.large]: size === 'large',
        [styles.strong]: weight === 'strong',
        [styles.critical]: tone === 'critical',
        [styles.neutral]: tone === 'neutral',
        [styles.truncate]: truncate,
      }),
    },
    children
  );
