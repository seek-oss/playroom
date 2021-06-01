import React from 'react';
import { render } from 'react-dom';
import Preview from './Playroom/Preview';
import playroomConfig from './config';
import getOrCreateRoot from './get-or-create-root';

const root = getOrCreateRoot(
  playroomConfig.htmlTemplate && playroomConfig.htmlTemplate['/preview']
);

const renderPreview = ({
  themes = require('./themes'),
  components = require('./components'),
  FrameComponent = require('./frameComponent'),
} = {}) => {
  render(
    <Preview
      components={components}
      themes={themes}
      FrameComponent={FrameComponent}
    />,
    root
  );
};
renderPreview();

if (module.hot) {
  module.hot.accept('./components', () => {
    renderPreview({ components: require('./components') });
  });

  module.hot.accept('./themes', () => {
    renderPreview({ themes: require('./themes') });
  });

  module.hot.accept('./frameComponent', () => {
    renderPreview({ FrameComponent: require('./frameComponent') });
  });
}
