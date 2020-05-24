import React, { ElementType, ReactNode } from 'react';
import classnames from 'classnames';

// @ts-ignore
import styles from './ToolbarPanel.less';

interface Props {
  children: ReactNode;
  as?: ElementType;
  'data-testid'?: string;
}

export const ToolbarPanel = ({
  as: component = 'aside',
  children,
  'data-testid': dataTestId,
}: Props) =>
  React.createElement(
    component,
    {
      className: classnames(styles.root),
      'data-testid': dataTestId,
    },
    children
  );
