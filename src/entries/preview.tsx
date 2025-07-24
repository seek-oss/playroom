import faviconInvertedPath from '../../images/favicon-inverted.png';
import faviconPath from '../../images/favicon.png';
import Frame from '../components/Frame/Frame';
import Preview from '../components/Preview/Preview';
import { PreviewError } from '../components/Preview/PreviewError';
import { renderElement } from '../render';
import { UrlParams } from '../utils/params';

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
  document.body
);
