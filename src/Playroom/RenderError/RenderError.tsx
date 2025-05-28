import clsx from 'clsx';
import type { ReactNode } from 'react';

import * as styles from './RenderError.css';

export const ErrorMessage = ({ children }: { children: ReactNode }) => (
  <div
    data-playroom-error
    className={clsx({
      [styles.errorMessage]: true,
      [styles.showError]: children,
    })}
  >
    {children}
  </div>
);
