import faviconInvertedPath from '../../images/favicon-inverted.png';
import faviconPath from '../../images/favicon.png';
import Playroom from '../components/Playroom/Playroom';
import components from '../configModules/components';
import snippets from '../configModules/snippets';
import themes from '../configModules/themes';
import { StoreProvider } from '../contexts/StoreContext';
import { renderElement } from '../render';

const outlet = document.createElement('div');
document.body.appendChild(outlet);

const selectedElement = document.head.querySelector('link[rel="icon"]');
const favicon = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? faviconInvertedPath
  : faviconPath;

if (selectedElement) {
  selectedElement.setAttribute('href', favicon);
}

const themeNames = Object.keys(themes);

renderElement(
  <StoreProvider themes={themeNames}>
    <Playroom components={components} themes={themeNames} snippets={snippets} />
  </StoreProvider>,
  outlet
);
