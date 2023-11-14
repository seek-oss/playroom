import type React from 'react';
import { parent } from './styles';

type Props = {
  color: 'red' | 'blue' | 'black';
  children: React.ReactNode;
};

export const Foo: React.FC<Props> = ({ color = 'black', children }) => (
  <div style={{ color }}>
    Foo{children ? <div style={parent}>{children}</div> : null}
  </div>
);
