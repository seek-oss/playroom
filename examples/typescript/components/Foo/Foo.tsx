import React, { Component, Fragment, ReactChild } from 'react';

interface Props {
  children?: ReactChild;
  color: 'red' | 'blue';
}

export default class Foo extends Component<Props> {
  render() {
    const { color, children } = this.props;

    return (
      <div style={{ color }}>
        Foo{children ? <Fragment>: {children}</Fragment> : null}
      </div>
    );
  }
}
