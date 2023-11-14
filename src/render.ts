import type { ReactElement, ReactNode } from 'react';
import ReactDOM, { version as reactDomVersion } from 'react-dom';

// Uses the correct render API based on the available version of
// `react-dom`. This hack can be removed when support for older
// versions of React is removed.
const canUseNewReactRootApi =
  reactDomVersion &&
  (reactDomVersion.startsWith('18') || reactDomVersion.startsWith('0.0.0'));

let __webpack_public_path__: string | undefined;

export const renderElement = async (node: ReactNode, outlet: HTMLElement) => {
  if (canUseNewReactRootApi) {
    // webpack needs to know the public path when doing dynamic imports,
    // otherwise the HTML chunk for the preview page, will end up importing
    // react-dom/client from the wront path
    if (typeof __webpack_public_path__ !== 'undefined') {
      __webpack_public_path__ = '../../../';
    }
    const { createRoot } = await import('react-dom/client');
    const root = createRoot(outlet);
    root.render(node);
  } else {
    // casting as ReactDOM.render requires a different type
    ReactDOM.render(node as ReactElement, outlet);
  }
};
