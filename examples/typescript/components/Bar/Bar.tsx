import React, { Component } from 'react';

interface Props {
  color: 'red' | 'blue';
}

export default class Bar extends Component<Props> {
  render() {
    const { color } = this.props;

    return <div style={{ color }}>Bar</div>;
  }
}
