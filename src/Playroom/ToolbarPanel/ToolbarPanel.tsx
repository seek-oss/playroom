import React, { type ElementType, type ReactNode } from 'react';

import * as styles from './ToolbarPanel.css';

interface Props {
  children: ReactNode;
  as?: ElementType;
}

export const ToolbarPanel = ({ as: component = 'aside', children }: Props) =>
  React.createElement(
    component,
    {
      className: styles.root,
    },
    children
  );
