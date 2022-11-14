import React from 'react';
import { render } from 'react-dom';
import Frame from './Playroom/Frame';
import { playroomThemes } from './themes';
import { playroomComponents } from './components';
import { playroomFrameComponent } from './frameComponent';

const outlet = document.createElement('div');

document.body.appendChild(outlet);

const renderFrame = ({
  themes = playroomThemes,
  components = playroomComponents,
  FrameComponent = playroomFrameComponent,
} = {}) => {
  render(
    <Frame
      components={components}
      themes={themes}
      FrameComponent={FrameComponent}
    />,
    outlet
  );
};

renderFrame();

if (import.meta.hot) {
  import.meta.hot.accept(
    ['./themes', './components', './frameComponent'],
    ([newThemesModule, newComponentsModule, newFrameComponentModule]) => {
      renderFrame({
        themes: newThemesModule?.playroomThemes,
        components: newComponentsModule?.playroomComponents,
        FrameComponent: newFrameComponentModule?.playroomFrameComponent,
      });
    }
  );
}
