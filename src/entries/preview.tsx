import faviconInvertedPath from '../../images/favicon-inverted.png';
import faviconPath from '../../images/favicon.png';
import Frame from '../Playroom/Frame/Frame';
import Preview from '../Playroom/Preview/Preview';
import { PreviewError } from '../Playroom/Preview/PreviewError';
import { renderElement } from '../render';
import { UrlParams } from '../utils/params';

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

renderElement(
  <UrlParams decodeUrl>
    {({ code, themeName, theme, title }) => (
      <Preview title={title}>
        <Frame
          code={code}
          themeName={themeName}
          theme={theme}
          ErrorComponent={PreviewError}
        />
      </Preview>
    )}
  </UrlParams>,
  outlet
);
