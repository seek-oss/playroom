import React, { Component } from 'react';

interface Props {
  color: 'red' | 'blue';
}

export default class Foo extends Component<Props> {
  render() {
    const { color } = this.props;

    return <div style={{ color }}>Foo</div>;
  }
}
