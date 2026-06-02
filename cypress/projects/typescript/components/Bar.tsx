import type React from 'react';

import { parent } from './styles';

type Props = {
  className?: string;
  color: 'red' | 'blue' | 'black';
  children: React.ReactNode;
};

export const Bar: React.FC<Props> = ({
  className,
  color = 'black',
  children,
}) => (
  <div className={className} style={{ color }}>
    Bar{children ? <div style={parent}>{children}</div> : null}
  </div>
);
