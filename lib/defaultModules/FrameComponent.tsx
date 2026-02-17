import type { ReactElement } from 'react';

import type { FrameSettingsValues } from '../../utils';

export default ({
  children,
}: {
  children: ReactElement;
  frameSettings?: FrameSettingsValues;
}) => <>{children}</>;
