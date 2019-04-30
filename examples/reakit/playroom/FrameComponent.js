import React from 'react';
import { Provider } from 'reakit';
import theme from 'reakit-theme-default';

export default ({ children }) => (
  <Provider theme={theme}>
    <React.Fragment>
      <style>{'* { font-family: Helvetica, Arial, sans-serif; }'}</style>
      {children}
    </React.Fragment>
  </Provider>
);
