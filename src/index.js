import React from 'react';
import { render } from 'react-dom';

import Playroom from './Playroom/Playroom';
import { StoreProvider } from './StoreContext/StoreContext';
import playroomConfig from './config';

const polyfillIntersectionObserver = () =>
  typeof window.IntersectionObserver !== 'undefined'
    ? Promise.resolve()
    : import('intersection-observer');

/**
 * Get the root where we want to render Playroom.
 * - If an `htmlTemplate` option is provided, use an element with ID "root" as the root.
 * - If no template is provided, simply create a `<div />` element and return it.
 */
const getOrCreateRoot = () => {
  if (playroomConfig.htmlTemplate) {
    const root = document.getElementById('root');

    if (!root) {
      // If #root element is not found, throw error as we won't be able to render Playroom.
      throw new Error(
        'No element found in body with ID "root". Playroom won\'t be rendered. Put a `<div id="root"></div>` in your HTML template where you want to render Playroom.'
      );
    }

    return root;
  }

  const outlet = document.createElement('div');
  document.body.appendChild(outlet);

  return outlet;
};

polyfillIntersectionObserver().then(() => {
  const widths = playroomConfig.widths || [320, 375, 768, 1024];
  const root = getOrCreateRoot();

  const renderPlayroom = ({
    themes = require('./themes'),
    components = require('./components'),
    snippets = require('./snippets'),
  } = {}) => {
    const themeNames = Object.keys(themes);

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
      root
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
