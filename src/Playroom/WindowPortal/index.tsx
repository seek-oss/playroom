import { type ReactNode, useEffect, useRef, useState } from 'react';
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

const createWindow = ({ width, height }: { width: number; height: number }) => {
  const containerDiv = document.createElement('div');
  containerDiv.style.height = '100vh';
  const newWindow = window.open(
    '',
    `${playroomConfig.storageKey}_editor`,
    `width=${width},height=${height},left=200,top=200`
  );

  if (newWindow) {
    newWindow.document.title = 'Playroom Editor';
    newWindow.document.body.innerHTML = '';
    copyStyles(document, newWindow.document);
  }

  return newWindow;
};

export const WindowPortal = ({
  width,
  height,
  children,
  onUnload,
  onKeyDown,
  onError,
}: Props) => {
  const externalWindow = useRef<Window | null>(null);
  const containerDiv = useRef<HTMLDivElement | null>(null);
  const [isClosedByParent, setClosedByParent] = useState(false);

  useEffect(() => {
    externalWindow.current = createWindow({ width, height });

    if (externalWindow.current && containerDiv.current) {
      externalWindow.current.document.body.appendChild(containerDiv.current);

      if (typeof onUnload === 'function') {
        externalWindow.current.addEventListener('unload', (e) => {
          // Call unload only if window portal is closed explicitly,
          // not if closed by parent.
          if (!isClosedByParent) {
            onUnload(e);
          }
        });
      }

      if (typeof onKeyDown === 'function') {
        externalWindow.current.addEventListener('keydown', onKeyDown);
      }

      // Close window portal when parent closes
      window.addEventListener('beforeunload', () => {
        setClosedByParent(true);

        if (externalWindow.current) {
          externalWindow.current.close();
        }
      });
    } else if (typeof onError === 'function') {
      // If blocked by pop-up blocker, call error handler
      onError();
    }

    return () => {
      if (externalWindow.current) {
        externalWindow.current.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return containerDiv.current
    ? ReactDOM.createPortal(children, containerDiv.current)
    : null;
};
