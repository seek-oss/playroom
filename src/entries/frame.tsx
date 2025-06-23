import Frame from '../Playroom/Frame/Frame';
import { SendErrorMessage } from '../Playroom/Frame/frameMessaging';
import playroomComponents from '../components';
import PlayroomFrameComponent from '../frameComponent';
import { renderElement } from '../render';
import playroomThemes from '../themes';
import { hmrAccept } from '../utils/hmr';
import { UrlParams } from '../utils/params';

const outlet = document.createElement('div');
document.body.appendChild(outlet);

const renderFrame = ({
  themes = playroomThemes,
  components = playroomComponents,
  FrameComponent = PlayroomFrameComponent,
} = {}) => {
  renderElement(
    <UrlParams themes={themes}>
      {({ code, themeName, theme }) => (
        <Frame
          code={code}
          components={components}
          themeName={themeName}
          theme={theme}
          FrameComponent={FrameComponent}
          ErrorComponent={SendErrorMessage}
        />
      )}
    </UrlParams>,
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
