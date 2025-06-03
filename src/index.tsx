import faviconInvertedPath from '../images/favicon-inverted.png';
import faviconPath from '../images/favicon.png';

import Playroom, { type PlayroomProps } from './Playroom/Playroom';
import { StoreProvider } from './StoreContext/StoreContext';
import playroomComponents from './components';
import playroomConfig from './config';
import { renderElement } from './render';
import playroomSnippets from './snippets';
import playroomThemes from './themes';
import { hmrAccept } from './utils/hmr';

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

const renderPlayroom = ({
  themes = playroomThemes,
  components = playroomComponents,
  snippets = playroomSnippets,
} = {}) => {
  const themeNames = Object.keys(themes);

  // Exclude undefined components, e.g. an exported TypeScript type.
  const filteredComponents = Object.fromEntries(
    Object.entries(components).filter(([_, value]) => value)
  );

  renderElement(
    <StoreProvider themes={themeNames} widths={widths}>
      <Playroom
        components={filteredComponents}
        widths={widths}
        themes={themeNames}
        snippets={snippets}
      />
    </StoreProvider>,
    outlet
  );
};
renderPlayroom();

hmrAccept((accept) => {
  accept('./components', () => {
    renderPlayroom({ components: playroomComponents });
  });

  accept('./themes', () => {
    renderPlayroom({ themes: playroomThemes });
  });

  accept('./snippets', () => {
    renderPlayroom({ snippets: playroomSnippets });
  });
});
