import faviconInvertedPath from '../images/favicon-inverted.png';
import faviconPath from '../images/favicon.png';

import Preview from './Playroom/Preview';
import playroomComponents from './components';
import frameComponent from './frameComponent';
import { renderElement } from './render';
import playroomThemes from './themes';
import { hmrAccept } from './utils/hmr';

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
  themes = playroomThemes,
  components = playroomComponents,
  FrameComponent = frameComponent,
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

hmrAccept((accept) => {
  accept('./components', () => {
    renderPreview({ components: playroomComponents });
  });

  accept('./themes', () => {
    renderPreview({ themes: playroomThemes });
  });

  accept('./frameComponent', () => {
    renderPreview({ FrameComponent: frameComponent });
  });
});
