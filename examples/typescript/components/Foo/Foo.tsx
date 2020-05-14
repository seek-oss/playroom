import React, { Component, ReactChild } from 'react';

interface Props {
  children?: ReactChild;
  color: 'red' | 'blue';
}
const parent = {
  border: '1px solid currentColor',
  padding: '10px 10px 10px 15px',
};

export default class Foo extends Component<Props> {
  render() {
    const { color = 'black', children } = this.props;

    return (
      <div style={{ color }}>
        Foo{children ? <div style={parent}>{children}</div> : null}
      </div>
    );
  }
}
