import faviconInvertedPath from '../../images/favicon-inverted.png';
import faviconPath from '../../images/favicon.png';
import Preview from '../components/Preview/Preview';
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
    {({ code, cssCode, themeName, title }) => (
      <>
        {cssCode ? (
          <style dangerouslySetInnerHTML={{ __html: cssCode }} />
        ) : null}
        <Preview title={title} code={code} themeName={themeName} />
      </>
    )}
  </UrlParams>
);
