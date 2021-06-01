import React from 'react';
import { ThemeProvider } from 'braid-design-system';

export default ({ theme, children }) => (
  <ThemeProvider theme={theme}>
    <React.Fragment>
      <style>{`html,body { margin: 0; }`}</style>
      {children}
    </React.Fragment>
  </ThemeProvider>
);
