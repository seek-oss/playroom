import clsx from 'clsx';
import type { ReactNode } from 'react';

import * as styles from './FrameError.css';

export const FrameError = ({
  message,
  delayVisibility,
  size = 'small',
}: {
  message: ReactNode;
  delayVisibility?: boolean;
  size?: keyof typeof styles.size;
}) => (
  <div
    data-testid="frameError"
    className={clsx({
      [styles.message]: true,
      [styles.size[size || 'small']]: true,
      [styles.show]: Boolean(message),
      [styles.delay]: delayVisibility,
    })}
  >
    {message}
  </div>
);
