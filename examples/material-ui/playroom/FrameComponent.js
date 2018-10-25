import React from 'react';
import { create } from 'jss';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';
import JssProvider from 'react-jss/lib/JssProvider';

export default class FrameComponent extends React.Component {
  constructor(props) {
    super(props);

    console.log(props.frameWindow.document.head);

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
        {children}
      </JssProvider>
    );
  }
}
