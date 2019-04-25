import React from 'react';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

export default class FrameComponent extends React.Component {
  render() {
    const { children } = this.props;

    return <MuiThemeProvider>{children}</MuiThemeProvider>;
  }
}
