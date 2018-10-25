import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { transform } from 'buble';
import scopeEval from 'scope-eval';

export default class RenderJsx extends Component {
  static displayName = 'RenderJsx';

  static propTypes = {
    jsx: PropTypes.string.isRequired,
    scope: PropTypes.object,
    initialState: PropTypes.object
  };

  static defaultProps = {
    scope: {},
    initialState: {}
  };

  constructor(props) {
    super(props);

    this.state = this.props.initialState;
  }

  render() {
    const { jsx, scope } = this.props;

    const fragment = `<React.Fragment>${jsx.trim() ||
      '<React.Fragment />'}</React.Fragment>`;
    const { code } = transform(fragment);
    const el = scopeEval(code, { ...scope, React, this: this });

    return el;
  }
}
