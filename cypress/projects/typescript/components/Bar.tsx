import type React from 'react';
import { parent } from './styles';

type Props = {
  color: 'red' | 'blue';
  children: React.ReactNode;
};

export const Bar: React.FC<Props> = ({ color = 'black', children }) => (
  <div style={{ color }}>
    Bar{children ? <div style={parent}>{children}</div> : null}
  </div>
);
