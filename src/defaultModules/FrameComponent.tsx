import type { ReactElement } from 'react';

import type { FrameSettingsValues } from '../../utils/index.ts';

export default ({
  children,
}: {
  children: ReactElement;
  frameSettings?: FrameSettingsValues;
}) => <>{children}</>;
