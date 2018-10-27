import React from 'react';
import { StyleGuideProvider } from 'seek-style-guide/react';

export default ({ children }) => (
  <StyleGuideProvider>{children}</StyleGuideProvider>
);
