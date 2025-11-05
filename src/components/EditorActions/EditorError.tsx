import { assignInlineVars } from '@vanilla-extract/dynamic';
import clsx from 'clsx';
import type { ReactNode } from 'react';

import { Text } from '../Text/Text';

import * as styles from './EditorError.css';

export const ErrorMessage = ({
  children,
  delay,
  action,
  actionLabel,
}: {
  children: ReactNode;
  delay?: number;
  action?: () => void;
  actionLabel?: string;
}) => (
  <div
    className={clsx({
      [styles.message]: true,
      [styles.show]: Boolean(children),
      [styles.entranceDelay]: typeof delay !== 'undefined',
    })}
    style={
      typeof delay !== 'undefined'
        ? assignInlineVars({
            [styles.delay]: String(delay),
          })
        : undefined
    }
    role="status"
    aria-live="assertive"
  >
    <Text>{children}</Text>
    {action && actionLabel ? (
      <button onClick={action} className={styles.button}>
        {actionLabel}
      </button>
    ) : null}
  </div>
);
