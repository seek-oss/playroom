import { renderElement } from './render';
import Preview from './Playroom/Preview';
import { hmrAccept } from './utils/hmr';
import playroomThemes from './themes';
import playroomComponents from './components';
import PlayroomFrameComponent from './frameComponent';

const outlet = document.createElement('div');
document.body.appendChild(outlet);

const renderPreview = ({
  themes = playroomThemes,
  components = playroomComponents,
  FrameComponent = PlayroomFrameComponent,
} = {}) => {
  renderElement(
    <Preview
      components={components}
      themes={themes}
      FrameComponent={FrameComponent}
    />,
    outlet
  );
};
renderPreview();

hmrAccept((accept) => {
  accept('./components', () => {
    renderPreview({ components: playroomComponents });
  });

  accept('./themes', () => {
    renderPreview({ themes: playroomThemes });
  });

  accept('./frameComponent', () => {
    renderPreview({ FrameComponent: PlayroomFrameComponent });
  });
});
