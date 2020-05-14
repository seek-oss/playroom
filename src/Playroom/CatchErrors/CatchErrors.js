import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text } from '../Text/Text';
import { Strong } from '../Strong/Strong';

import styles from './CatchErrors.less';

export default class CatchErrors extends Component {
  static propTypes = {
    code: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  };

  state = {
    error: null,
    invalidCode: null,
    info: null,
  };

  componentDidCatch(error, info) {
    const { code } = this.props;
    this.setState({ invalidCode: code, error, info });
  }

  render() {
    const { invalidCode, error, info } = this.state;
    const { code, children } = this.props;

    if (code !== invalidCode) {
      return children;
    }

    // Ensure the stack only contains user-provided components
    const componentStack = info.componentStack
      .split('\n')
      .filter((line) => /RenderCode/.test(line))
      .map((line) => line.replace(/ \(created by .*/g, ''));

    // Ignore the RenderCode container component
    const lines = componentStack.slice(0, componentStack.length - 1);

    return (
      <div className={styles.root}>
        <Text size="large" tone="critical">
          <Strong>{error.message}</Strong>
          {lines.map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </Text>
      </div>
    );
  }
}
