import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Fade extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    delay: PropTypes.number
  };

  static defaultProps = {
    delay: 0
  };

  state = { visible: false };

  componentDidMount() {
    setTimeout(() => this.setState({ visible: true }), 0);
  }

  render() {
    const { children, delay } = this.props;
    const { visible } = this.state;

    const style = {
      transition: 'opacity 200ms ease',
      transitionDelay: `${delay}ms`,
      opacity: visible ? 1 : 0
    };

    return (
      <div style={style}>
        {children}
      </div>
    );
  }
}
