import React, { SVGProps } from 'react';
import classnames from 'classnames';

// @ts-ignore
import styles from './ChevronIcon.less';

interface ChevronSvgProps extends SVGProps<SVGSVGElement> {
  direction?: 'down' | 'up' | 'left' | 'right';
  size?: number;
}

export default ({
  direction = 'down',
  size = 24,
  ...props
}: ChevronSvgProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    focusable="false"
    fill="currentColor"
    className={classnames(styles.root, {
      [styles.up]: direction === 'up',
      [styles.left]: direction === 'left',
      [styles.right]: direction === 'right',
    })}
    {...props}
  >
    <path d="M20.7 7.3c-.4-.4-1-.4-1.4 0L12 14.6 4.7 7.3c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l8 8c.2.2.5.3.7.3s.5-.1.7-.3l8-8c.4-.4.4-1 0-1.4z" />
  </svg>
);
