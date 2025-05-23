import classnames from 'classnames';
import type { ReactElement } from 'react';

import * as styles from './Inline.css';

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
  alignY?: keyof typeof styles.horizontalAlignmentScale;
}

export const Inline = ({ children, space, alignY }: Props) => (
  <div
    className={classnames(
      styles.gap,
      styles.spaceScale[space],
      alignY ? styles.horizontalAlignmentScale[alignY] : undefined
    )}
  >
    {children}
  </div>
);
