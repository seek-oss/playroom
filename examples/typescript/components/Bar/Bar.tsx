import React, { Component } from 'react';

interface Props {
  /** The color of the Bar component's text */
  color: 'red' | 'blue';
  /** 
   * The count of schmeckles 
   * @default 42
   */
  count?: number;
}

/** A fancy component */
export default class Bar extends Component<Props> {
  render() {
    const { color } = this.props;

    return <div style={{ color }}>Bar</div>;
  }
}
