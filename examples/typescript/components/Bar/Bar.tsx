import React, { Component, Fragment, ReactChild } from 'react';

interface Props {
  children?: ReactChild;
  color: 'red' | 'blue';
}

export default class Bar extends Component<Props> {
  render() {
    const { color, children } = this.props;

    return (
      <div style={{ color }}>
        Bar{children ? <Fragment>: {children}</Fragment> : null}
      </div>
    );
  }
}
