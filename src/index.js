import { renderElement } from './render';
import Playroom from './Playroom/Playroom';
import { StoreProvider } from './StoreContext/StoreContext';
import playroomConfig from './config';
import faviconPath from '../images/favicon.png';
import faviconInvertedPath from '../images/favicon-inverted.png';

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
    themes = require('./themes'),
    components = require('./components'),
    snippets = require('./snippets'),
  } = {}) => {
    const themeNames = Object.keys(themes);

    // Exclude undefined components, e.g. an exported TypeScript type.
    const filteredComponents = Object.fromEntries(
      Object.entries(components).filter(([_, value]) => value)
    );

    renderElement(
      <StoreProvider
        themes={themeNames}
        widths={widths}
        defaultVisibleThemes={playroomConfig.defaultVisibleThemes}
        defaultVisibleWidths={playroomConfig.defaultVisibleWidths}
      >
        <Playroom
          components={filteredComponents}
          widths={widths}
          themes={themeNames}
          snippets={
            typeof snippets.default !== 'undefined'
              ? snippets.default
              : snippets
          }
        />
      </StoreProvider>,
      outlet
    );
  };
  renderPlayroom();

  if (module.hot) {
    module.hot.accept('./components', () => {
      renderPlayroom({ components: require('./components') });
    });

    module.hot.accept('./themes', () => {
      renderPlayroom({ themes: require('./themes') });
    });

    module.hot.accept('./snippets', () => {
      renderPlayroom({ snippets: require('./snippets') });
    });
  }
});
