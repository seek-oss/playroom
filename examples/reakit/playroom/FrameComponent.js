import React from 'react';
import { StyleSheetManager } from 'styled-components';
import { Provider } from 'reakit';
import theme from 'reakit-theme-default';

export default ({ children }) => (
  <Provider theme={theme}>
    <StyleSheetManager target={window.document.head}>
      <React.Fragment>
        <style>{'* { font-family: Helvetica, Arial, sans-serif; }'}</style>
        {children}
      </React.Fragment>
    </StyleSheetManager>
  </Provider>
);
