import React, { Component } from 'react';
import getParamsFromQuery from '../utils/getParamsFromQuery';
import CatchErrors from './CatchErrors/CatchErrors';
import RenderCode from './RenderCode/RenderCode';

export default class Frame extends Component {
  constructor(props) {
    super(props);

    const { themeName, code = '' } = getParamsFromQuery();

    this.state = {
      themeName,
      code,
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      const { themeName, code } = getParamsFromQuery();

      if (themeName && code) {
        this.setState({ themeName, code });
      }
    });
  }

  render() {
    const { themeName, code } = this.state;
    const { themes, components, FrameComponent } = this.props;

    const resolvedThemeName =
      themeName === '__PLAYROOM__NO_THEME__' ? null : themeName;
    const resolvedTheme = resolvedThemeName ? themes[resolvedThemeName] : null;

    return (
      <CatchErrors code={code}>
        <FrameComponent themeName={resolvedThemeName} theme={resolvedTheme}>
          <RenderCode code={code} scope={components} />
        </FrameComponent>
      </CatchErrors>
    );
  }
}
