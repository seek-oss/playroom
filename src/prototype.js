import React from 'react';
import { render } from 'react-dom';
import Prototype from './Playroom/Prototype';

const outlet = document.createElement('div');
document.body.appendChild(outlet);

const renderPrototype = ({
  themes = require('./themes'),
  components = require('./components'),
  FrameComponent = require('./frameComponent')
} = {}) => {
  render(
    <Prototype
      components={components}
      themes={themes}
      FrameComponent={FrameComponent}
    />,
    outlet
  );
};
renderPrototype();

if (module.hot) {
  module.hot.accept('./components', () => {
    renderPrototype({ components: require('./components') });
  });

  module.hot.accept('./themes', () => {
    renderPrototype({ themes: require('./themes') });
  });

  module.hot.accept('./frameComponent', () => {
    renderPrototype({ FrameComponent: require('./frameComponent') });
  });
}
