import faviconInvertedPath from '../images/favicon-inverted.png';
import faviconPath from '../images/favicon.png';

import Frame from './Playroom/Frame/Frame';
import Preview from './Playroom/Preview/Preview';
import { PreviewError } from './Playroom/Preview/PreviewError';
import playroomComponents from './components';
import frameComponent from './frameComponent';
import { renderElement } from './render';
import playroomThemes from './themes';
import { hmrAccept } from './utils/hmr';
import { UrlParams } from './utils/params';

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
    <UrlParams themes={themes} decodeUrl>
      {({ code, themeName, theme, title }) => (
        <Preview title={title}>
          <Frame
            code={code}
            components={components}
            themeName={themeName}
            theme={theme}
            FrameComponent={FrameComponent}
            ErrorComponent={PreviewError}
          />
        </Preview>
      )}
    </UrlParams>,
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
