// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { ThemeProvider } from '@uifabric/foundation';

export default ({ theme, children }) => (
  <Fabric>
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </Fabric>
);
