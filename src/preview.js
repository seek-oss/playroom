import React from 'react';
import { render } from 'react-dom';
import Preview from './Playroom/Preview';

const outlet = document.createElement('div');
document.body.appendChild(outlet);

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
    outlet
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
