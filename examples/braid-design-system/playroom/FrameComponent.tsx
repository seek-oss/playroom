import React from 'react';
import { BraidProvider } from 'braid-design-system';

export default ({ theme, children }) => (
  <BraidProvider theme={theme}>{children}</BraidProvider>
);
