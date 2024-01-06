import { renderElement } from './render';
import Frame from './Playroom/Frame';
import { hmrAccept } from './utils/hmr';
import playroomThemes from './themes';
import playroomComponents from './components';
import PlayroomFrameComponent from './frameComponent';

const outlet = document.createElement('div');
document.body.appendChild(outlet);

const renderFrame = ({
  themes = playroomThemes,
  components = playroomComponents,
  FrameComponent = PlayroomFrameComponent,
} = {}) => {
  renderElement(
    <Frame
      components={components}
      themes={themes}
      FrameComponent={FrameComponent}
    />,
    outlet
  );
};
renderFrame();

hmrAccept((accept) => {
  accept('./components', () => {
    renderFrame({ components: playroomComponents });
  });

  accept('./themes', () => {
    renderFrame({ themes: playroomThemes });
  });

  accept('./frameComponent', () => {
    renderFrame({ FrameComponent: PlayroomFrameComponent });
  });
});
