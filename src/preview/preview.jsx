import React from 'react';
import { render } from 'react-dom';
import Preview from '../Playroom/Preview';
import { playroomThemes } from '../themes';
import { playroomComponents } from '../components';
import { playroomFrameComponent } from '../frameComponent';

const outlet = document.createElement('div');

document.body.appendChild(outlet);

const renderPreview = ({
  themes = playroomThemes,
  components = playroomComponents,
  FrameComponent = playroomFrameComponent,
} = {}) => {
  render(
    <Preview
      themes={themes}
      components={components}
      FrameComponent={FrameComponent}
    />,
    outlet
  );
};

renderPreview();

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
