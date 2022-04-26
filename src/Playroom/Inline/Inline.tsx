import React, { ReactElement, Children } from 'react';
import classnames from 'classnames';

import * as styles from './Inline.css';

interface ReactNodeArray extends Array<ReactNodeNoStrings> {}
type ReactNodeNoStrings =
  | ReactElement
  | ReactNodeArray
  | boolean
  | null
  | undefined;

interface Props {
  children: ReactNodeNoStrings;
  space:
    | 'none'
    | 'xxsmall'
    | 'xsmall'
    | 'small'
    | 'medium'
    | 'large'
    | 'xlarge';
}

export const Inline = ({ children, space }: Props) => (
  <div className={classnames(styles.root, space !== 'none' && styles[space])}>
    {Children.toArray(children).map((item, index) => (
      <div key={index} className={styles.item}>
        {item}
      </div>
    ))}
  </div>
);
