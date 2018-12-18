import React from 'react';
import PropTypes from 'prop-types';

const withPropTypes = component => {
  component.propTypes = {
    color: PropTypes.oneOf(['red', 'blue'])
  };

  return component;
};

export const Foo = withPropTypes(({ color }) => (
  <div style={{ color }}>Foo</div>
));

export const Bar = withPropTypes(({ color }) => (
  <div style={{ color }}>Bar</div>
));
