import type { ReactNode } from 'react';
import type { Theme } from './themes';

const parent = {
  border: '1px solid currentColor',
  padding: '10px 10px 10px 15px',
};

const FrameComponent = ({
  theme,
  children,
}: {
  theme: Theme;
  children: ReactNode;
}) => (
  <div>
    FrameComponent (theme: &quot;{theme.name}&quot;)
    {children ? <div style={parent}>{children}</div> : null}
  </div>
);

export default FrameComponent;
