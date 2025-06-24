import faviconInvertedPath from '../../images/favicon-inverted.png';
import faviconPath from '../../images/favicon.png';
import Playroom, { type PlayroomProps } from '../components/Playroom/Playroom';
import playroomConfig from '../config';
import components from '../configModules/components';
import snippets from '../configModules/snippets';
import themes from '../configModules/themes';
import { StoreProvider } from '../contexts/StoreContext';
import { renderElement } from '../render';

const suppliedWidths = playroomConfig.widths || [320, 375, 768, 1024];
const widths: PlayroomProps['widths'] = [...suppliedWidths, 'Fit to window'];

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
  <StoreProvider themes={themeNames} widths={widths}>
    <Playroom
      components={components}
      widths={widths}
      themes={themeNames}
      snippets={snippets}
    />
  </StoreProvider>,
  outlet
);
