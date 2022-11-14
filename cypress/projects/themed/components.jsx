import React from 'react';
import PropTypes from 'prop-types';

const withPropTypes = (component) => {
  component.propTypes = {
    color: PropTypes.oneOf(['red', 'blue']),
    children: PropTypes.node,
  };

  return component;
};
const parent = {
  border: '1px solid currentColor',
  padding: '10px 10px 10px 15px',
};

export const Foo = withPropTypes(({ color = 'black', children }) => (
  <div style={{ color }}>
    Foo{children ? <div style={parent}>{children}</div> : null}
  </div>
));

export const Bar = withPropTypes(({ color = 'black', children }) => (
  <div style={{ color }}>
    Bar{children ? <div style={parent}>{children}</div> : null}
  </div>
));
