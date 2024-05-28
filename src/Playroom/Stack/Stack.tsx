import type { ReactElement } from 'react';
import classnames from 'classnames';

import * as styles from './Stack.css';

interface ReactNodeArray extends Array<ReactNodeNoStrings> {}
type ReactNodeNoStrings =
  | ReactElement
  | ReactNodeArray
  | boolean
  | null
  | undefined;

interface Props {
  children: ReactNodeNoStrings;
  space: keyof typeof styles.spaceScale;
}

export const Stack = ({ children, space }: Props) => (
  <div className={classnames(styles.gap, styles.spaceScale[space])}>
    {children}
  </div>
);
