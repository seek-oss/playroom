import React, { Component } from 'react';
import queryString from 'query-string';
import CatchErrors from './CatchErrors/CatchErrors';
import RenderCode from './RenderCode/RenderCode';

const themesImport = require('./themes');
const componentsImport = require('./components');
const frameComponentImport = require('./frameComponent');

const getQueryParams = (url = window.location.href) => {
  try {
    const hash = url.split('#')[1] || '';
    return queryString.parse(hash);
  } catch (err) {
    return {};
  }
};

export default class Frame extends Component {
  constructor(props) {
    super(props);

    const { themeName, code = '' } = getQueryParams();

    this.state = {
      themeName,
      themes: themesImport,
      components: componentsImport,
      FrameComponent: frameComponentImport,
      code
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', ({ newURL }) => {
      const { themeName, code } = getQueryParams(newURL);

      if (themeName && code) {
        this.setState({ themeName, code });
      }
    });

    if (module.hot) {
      module.hot.accept('./themes', () => {
        this.setState({ themes: require('./themes') });
      });

      module.hot.accept('./components', () => {
        this.setState({ components: require('./components') });
      });

      module.hot.accept('./frameComponent', () => {
        this.setState({ frameComponent: require('./frameComponent') });
      });
    }
  }

  render() {
    const { FrameComponent, themes, themeName, components, code } = this.state;

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
