import React from 'react';
import { render } from 'react-dom';
import Preview from './Playroom/Preview';

const outlet = document.createElement('div');
document.body.appendChild(outlet);

const renderPreview = ({
  themes = require('./themes'),
  components = require('./components'),
  FrameComponent = require('./frameComponent'),
  PreviewComponent = require('./previewComponent')
} = {}) => {
  render(
    <Preview
      components={components}
      themes={themes}
      FrameComponent={FrameComponent}
      PreviewComponent={PreviewComponent}
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

  module.hot.accept('./previewComponent', () => {
    renderPreview({ PreviewComponent: require('./previewComponent') });
  });
}
