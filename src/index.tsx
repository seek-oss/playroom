import { renderElement } from './render';
import Playroom from './Playroom/Playroom';
import { StoreProvider } from './StoreContext/StoreContext';
import playroomConfig from './config';
import faviconPath from '../images/favicon.png';
import faviconInvertedPath from '../images/favicon-inverted.png';
import playroomThemes from './themes';
import playroomComponents from './components';
import playroomSnippets from './snippets';
import { hmrAccept } from './utils/hmr';

const polyfillIntersectionObserver = () =>
  typeof window.IntersectionObserver !== 'undefined'
    ? Promise.resolve()
    : import('intersection-observer');

polyfillIntersectionObserver().then(() => {
  const widths = playroomConfig.widths || [320, 375, 768, 1024];

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
});
