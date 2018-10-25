import React, { Component } from 'react';
import PropTypes from 'prop-types';
import urlJoin from 'url-join';

const collectStyleContent = () => {
  const styleNodes = document.querySelectorAll('style, link[rel="stylesheet"]');

  const sheetPromises = Array.from(styleNodes).map(el => {
    if (el.nodeName === 'STYLE') {
      return Promise.resolve(el.innerHTML);
    }

    const url = el.getAttribute('href');

    return fetch(url)
      .then(response => response.text())
      .catch(err => {
        console.error(`Failed to load CSS from ${url}`, err);
        return '';
      });
  });

  return Promise.all(sheetPromises).then(sheets => sheets.join('\n'));
};

export default class CollectStyles extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired
  };

  state = {
    styleContent: ''
  };

  componentDidMount() {
    collectStyleContent().then(styleContent => {
      this.setState({ styleContent });
    });
  }

  render() {
    const { styleContent } = this.state;

    if (!styleContent) {
      return this.props.children(null);
    }

    return this.props.children(<style type="text/css">{styleContent}</style>);
  }
}
