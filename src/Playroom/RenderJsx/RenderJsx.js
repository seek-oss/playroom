import React from 'react';
import PropTypes from 'prop-types';
import { transform } from 'buble';
import scopeEval from 'scope-eval';

const RenderJsx = ({ jsx, scope, initialState }) => {
  const fragment = `<React.Fragment>${jsx.trim() ||
    '<React.Fragment />'}</React.Fragment>`;
  const { code } = transform(fragment);
  const el = scopeEval(code, { ...scope, React, initialState });
  console.log(el);

  return <React.Fragment>{el}</React.Fragment>;
};

RenderJsx.displayName = 'RenderJsx';

RenderJsx.propTypes = {
  jsx: PropTypes.string.isRequired,
  scope: PropTypes.object,
  initialState: PropTypes.object
};

RenderJsx.defaultProps = {
  scope: {},
  initialState: {}
};

export default RenderJsx;
