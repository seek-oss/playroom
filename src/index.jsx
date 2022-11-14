import React from 'react';
import { render } from 'react-dom';

import Playroom from './Playroom/Playroom';
import { StoreProvider } from './StoreContext/StoreContext';
import playroomConfig from './config';
import { playroomThemes } from './themes';
import { playroomComponents } from './components';
import { playroomSnippets } from './snippets';

const polyfillIntersectionObserver = () =>
  typeof window.IntersectionObserver !== 'undefined'
    ? Promise.resolve()
    : import('intersection-observer');

let outlet;

polyfillIntersectionObserver().then(async () => {
  const widths = playroomConfig.widths || [320, 375, 768, 1024];

  outlet = document.createElement('div');
  document.body.appendChild(outlet);

  const renderPlayroom = ({
    themes = playroomThemes,
    importedComponents = playroomComponents,
    snippets = playroomSnippets,
  } = {}) => {
    const themeNames = Object.keys(themes);

    // Exclude undefined components, e.g. an exported TypeScript type.
    const components = Object.fromEntries(
      Object.entries(importedComponents).filter(([_, value]) => value)
    );

    render(
      <StoreProvider themes={themeNames} widths={widths}>
        <Playroom
          components={components}
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

  if (import.meta.hot) {
    import.meta.hot.accept(
      ['./themes', './components', './snippets'],
      ([newThemesModule, newComponentsModule, newSnippets]) => {
        renderPlayroom({
          themes: newThemesModule?.playroomThemes,
          importedComponents: newComponentsModule?.playroomComponents,
          snippets: newSnippets?.playroomSnippets,
        });
      }
    );
  }
});
