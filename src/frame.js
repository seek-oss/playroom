import Frame from './Playroom/Frame';
import { SendErrorMessage } from './Playroom/Frames/frameMessaging';
import { renderElement } from './render';

const outlet = document.createElement('div');
document.body.appendChild(outlet);

const renderFrame = ({
  themes = require('./themes'),
  components = require('./components'),
  FrameComponent = require('./frameComponent'),
} = {}) => {
  renderElement(
    <Frame
      components={components}
      themes={themes}
      FrameComponent={FrameComponent}
      ErrorComponent={SendErrorMessage}
    />,
    outlet
  );
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
