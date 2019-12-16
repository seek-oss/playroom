import React, { Component, AllHTMLAttributes } from 'react';

interface State {
  loaded: boolean;
}
interface Props extends AllHTMLAttributes<HTMLIFrameElement> {}

export default class Iframe extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      loaded: false
    };
  }

  handleLoad = () => {
    this.setState({ loaded: true });
  };

  render() {
    const { style, ...props } = this.props;
    const { loaded } = this.state;

    const combinedStyles = {
      ...style,
      transition: 'opacity .3s ease',
      opacity: loaded ? 1 : 0
    };

    return (
      <iframe onLoad={this.handleLoad} {...props} style={combinedStyles} />
    );
  }
}
