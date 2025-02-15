import ReactDOM, { version as reactDomVersion } from 'react-dom';

// Uses the correct render API based on the available version of
// `react-dom`. This hack can be removed when support for older
// versions of React is removed.

const mainVersion = Number(reactDomVersion.split('.')[0]);
const canUseNewReactRootApi =
  reactDomVersion &&
  (mainVersion >= 18 || reactDomVersion.startsWith('0.0.0'));

export const renderElement = (node, outlet) => {
  if (canUseNewReactRootApi) {
    // eslint-disable-next-line import/no-unresolved
    const { createRoot } = require('react-dom/client');
    const root = createRoot(outlet);
    root.render(node);
  } else {
    ReactDOM.render(node, outlet);
  }
};
