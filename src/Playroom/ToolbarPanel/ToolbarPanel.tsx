import React, { ElementType, ReactNode } from 'react';

import * as styles from './ToolbarPanel.css';

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
      className: styles.root,
      'data-testid': dataTestId,
    },
    children
  );
