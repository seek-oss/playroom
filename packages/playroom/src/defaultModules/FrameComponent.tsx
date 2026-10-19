import type { ReactElement } from 'react';

import type { FrameSettingsValues } from '../index';

export default ({
  children,
}: {
  children: ReactElement;
  frameSettings?: FrameSettingsValues;
}) => <>{children}</>;
