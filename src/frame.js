import React from 'react';
import { render } from 'react-dom';
import Frame from './Playroom/Frame';
import playroomConfig from './config';

const outlet = document.createElement('div');
document.body.appendChild(outlet);

const renderFrame = ({
  themes = require('./themes'),
  components = require('./components'),
  FrameComponent = require('./frameComponent'),
} = {}) => {
  const frame = (
    <Frame
      components={components}
      themes={themes}
      FrameComponent={FrameComponent}
    />
  );

  if (playroomConfig.unstable_concurrentMode) {
    const { unstable_createRoot } = require('react-dom');
    unstable_createRoot(outlet).render(frame);
  } else {
    render(frame, outlet);
  }
};
renderFrame();

if (module.hot) {
  module.hot.accept('./components', () => {
    renderFrame({ components: require('./components') });
  });

  module.hot.accept('./themes', () => {
    renderFrame({ themes: require('./themes') });
  });

  module.hot.accept('./frameComponent', () => {
    renderFrame({ FrameComponent: require('./frameComponent') });
  });
}
