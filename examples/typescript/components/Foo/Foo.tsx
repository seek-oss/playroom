import React, { Component } from 'react';

interface Props {
  /** 
   * The color of the Foo components text 
   * @default 'red' 
   */
  color?: 'red' | 'blue';
  /** 
   * Do something special
   * @default false 
   */
  active?: boolean
}

/** A basic component */
export default class Foo extends Component<Props> {

  render() {
    const { color } = this.props;

    return <div style={{ color }}>Foo</div>;
  }
}
