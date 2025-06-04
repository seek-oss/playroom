import clsx from 'clsx';
import type { ReactNode } from 'react';

import * as styles from './RenderError.css';

export const ErrorMessage = ({
  errorMessage,
  delayVisibility,
  size = 'small',
}: {
  errorMessage: ReactNode;
  delayVisibility?: boolean;
  size?: keyof typeof styles.size;
}) => (
  <div
    data-testid="errorMessage"
    className={clsx({
      [styles.errorMessage]: true,
      [styles.size[size || 'small']]: true,
      [styles.showError]: errorMessage,
      [styles.delay]: delayVisibility,
    })}
  >
    {errorMessage}
  </div>
);
