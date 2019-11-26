import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const copyStyles = (sourceDoc, targetDoc) => {
  Array.from(sourceDoc.styleSheets).forEach(styleSheet => {
    if (styleSheet.cssRules) {
      // true for inline styles
      const newStyleEl = sourceDoc.createElement('style');

      Array.from(styleSheet.cssRules).forEach(cssRule => {
        newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
      });

      targetDoc.head.appendChild(newStyleEl);
    } else if (styleSheet.href) {
      // true for stylesheets loaded from a URL
      const newLinkEl = sourceDoc.createElement('link');

      newLinkEl.rel = 'stylesheet';
      newLinkEl.href = styleSheet.href;
      targetDoc.head.appendChild(newLinkEl);
    }
  });
};

export default class WindowPortal extends React.PureComponent {
  static propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    onKeyDown: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { externalWindow: null, containerDiv: null };
  }

  componentDidMount() {
    this.createWindow();
  }

  componentWillUnmount() {
    const { externalWindow } = this.state;

    if (externalWindow) {
      externalWindow.close();
    }
  }

  createWindow = () => {
    const containerDiv = document.createElement('div');
    containerDiv.style.height = '100vh';
    const externalWindow = window.open(
      '',
      '',
      `width=${this.props.width},height=${this.props.height},left=200,top=200`
    );

    externalWindow.document.title = 'Playroom Editor';
    externalWindow.document.body.appendChild(containerDiv);
    externalWindow.addEventListener('beforeunload', this.props.onClose);
    externalWindow.addEventListener('keydown', this.props.onKeyDown);

    copyStyles(document, externalWindow.document);
    this.setState({ externalWindow, containerDiv });
  };

  render() {
    const { containerDiv } = this.state;

    if (!containerDiv) {
      return null;
    }

    return ReactDOM.createPortal(this.props.children, containerDiv);
  }
}
