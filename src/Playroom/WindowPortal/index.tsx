import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';

import playroomConfig from '../../config';

const copyStyles = (sourceDoc: Document, targetDoc: Document) => {
  const list = Array.from(sourceDoc.styleSheets) as CSSStyleSheet[];

  list.forEach((styleSheet) => {
    if (styleSheet.cssRules) {
      // true for inline styles
      const newStyleEl = sourceDoc.createElement('style');

      Array.from(styleSheet.cssRules).forEach((cssRule) => {
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

interface Props {
  height: number;
  width: number;
  onKeyDown?: (event: KeyboardEvent) => void;
  onUnload: (event?: Event) => void;
  onError?: () => void;
  children: ReactNode;
}

interface State {
  externalWindow: Window | null;
  containerDiv: HTMLDivElement | null;
  isClosedByParent: boolean;
}

export default class WindowPortal extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      externalWindow: null,
      containerDiv: null,
      isClosedByParent: false,
    };
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
      `${playroomConfig.storageKey}_editor`,
      `width=${this.props.width},height=${this.props.height},left=200,top=200`
    );

    if (externalWindow) {
      externalWindow.document.title = 'Playroom Editor';
      externalWindow.document.body.innerHTML = '';
      externalWindow.document.body.appendChild(containerDiv);

      if (typeof this.props.onUnload === 'function') {
        externalWindow.addEventListener('unload', (e) => {
          // Call unload only if window portal is closed explicitly,
          // not if closed by parent.
          if (!this.state.isClosedByParent) {
            this.props.onUnload(e);
          }
        });
      }

      if (typeof this.props.onKeyDown === 'function') {
        externalWindow.addEventListener('keydown', this.props.onKeyDown);
      }

      copyStyles(document, externalWindow.document);
      this.setState({ externalWindow, containerDiv });

      // Close window portal when parent closes
      window.addEventListener('beforeunload', () => {
        this.setState({ isClosedByParent: true });
        externalWindow.close();
      });
    } else if (typeof this.props.onError === 'function') {
      // If blocked by pop-up blocker, call error handler
      this.props.onError();
    }
  };

  render() {
    const { containerDiv } = this.state;

    if (!containerDiv) {
      return null;
    }

    return ReactDOM.createPortal(this.props.children, containerDiv);
  }
}
