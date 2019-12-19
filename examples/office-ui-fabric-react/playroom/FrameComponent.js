// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { ThemeProvider } from '@uifabric/foundation';
import { initializeIcons } from '@uifabric/icons';

initializeIcons();

export default ({ children }) => (
  <Fabric>
    <ThemeProvider>{children}</ThemeProvider>
  </Fabric>
);
