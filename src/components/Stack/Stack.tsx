import clsx from 'clsx';
import type { ReactElement } from 'react';

import * as styles from './Stack.css';

type ReactNodeArray = ReactNodeNoStrings[];
type ReactNodeNoStrings =
  | ReactElement
  | ReactNodeArray
  | boolean
  | null
  | undefined;

interface Props {
  children: ReactNodeNoStrings;
  space: keyof typeof styles.spaceScale;
  align?: keyof typeof styles.horizontalAlignmentScale;
}

export const Stack = ({ children, space, align }: Props) => (
  <div
    className={clsx(
      styles.gap,
      styles.spaceScale[space],
      align ? styles.horizontalAlignmentScale[align] : null
    )}
  >
    {children}
  </div>
);
