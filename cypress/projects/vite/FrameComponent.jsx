import React from 'react';

const parent = {
  border: '1px solid currentColor',
  padding: '10px 10px 10px 15px',
};

const FrameComponent = ({  children }) => (
  <div>
    FrameComponent{children ? <div style={parent}>{children}</div> : null}
  </div>
);

export default FrameComponent
