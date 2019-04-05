import React, { Component } from 'react';
import PropTypes from 'prop-types';
import scopeEval from 'scope-eval';

export default class RenderCode extends Component {
  static displayName = 'RenderCode';

  static propTypes = {
    code: PropTypes.string.isRequired,
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
    const { code, scope } = this.props;

    const el = scopeEval(code, { ...scope, React, this: this });

    return el;
  }
}
