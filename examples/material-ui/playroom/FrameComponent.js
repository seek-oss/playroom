import React from 'react';
import { create } from 'jss';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';
import JssProvider from 'react-jss/lib/JssProvider';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

export default class FrameComponent extends React.Component {
  constructor(props) {
    super(props);

    this.generateClassName = createGenerateClassName();
    this.jss = create({
      ...jssPreset(),
      insertionPoint: props.frameWindow.document.head
    });
  }

  render() {
    const { children } = this.props;

    return (
      <JssProvider jss={this.jss} generateClassName={this.generateClassName}>
        <MuiThemeProvider sheetsManager={new Map()}>
          {children}
        </MuiThemeProvider>
      </JssProvider>
    );
  }
}
