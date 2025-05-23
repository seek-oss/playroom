import faviconInvertedPath from '../images/favicon-inverted.png';
import faviconPath from '../images/favicon.png';

import Preview from './Playroom/Preview';
import { renderElement } from './render';

const outlet = document.createElement('div');
document.body.appendChild(outlet);

const selectedElement = document.head.querySelector('link[rel="icon"]');
const favicon = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? faviconInvertedPath
  : faviconPath;

const formattedFavicon = `../${favicon}`;

if (selectedElement) {
  selectedElement.setAttribute('href', formattedFavicon);
}

const renderPreview = ({
  themes = require('./themes'),
  components = require('./components'),
  FrameComponent = require('./frameComponent'),
} = {}) => {
  renderElement(
    <Preview
      components={components}
      themes={themes}
      FrameComponent={FrameComponent}
    />,
    outlet
  );
};
renderPreview();

if (module.hot) {
  module.hot.accept('./components', () => {
    renderPreview({ components: require('./components') });
  });

  module.hot.accept('./themes', () => {
    renderPreview({ themes: require('./themes') });
  });

  module.hot.accept('./frameComponent', () => {
    renderPreview({ FrameComponent: require('./frameComponent') });
  });
}
