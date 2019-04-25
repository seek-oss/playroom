import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styles from './CatchErrors.less';

export default class CatchErrors extends Component {
  static propTypes = {
    code: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
  };

  state = {
    error: null,
    invalidCode: null,
    info: null
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
      .filter(line => /RenderCode/.test(line))
      .map(line => line.replace(/ \(created by .*/g, ''));

    // Ignore the RenderCode container component
    const lines = componentStack.slice(0, componentStack.length - 1);

    return (
      <div className={styles.root}>
        <div style={{ paddingTop: 20 }}>
          <Fragment>
            <div className={styles.strong}>{error.message}</div>
            {lines.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </Fragment>
        </div>
      </div>
    );
  }
}
