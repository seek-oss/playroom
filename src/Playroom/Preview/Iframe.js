import React, { Component } from 'react';

export default class Iframe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false
    };
  }

  componentDidMount() {}

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
