import React, { ReactElement, Children } from 'react';
import classnames from 'classnames';

import { Divider } from '../Divider/Divider';

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
  space:
    | 'none'
    | 'xxsmall'
    | 'xsmall'
    | 'small'
    | 'medium'
    | 'large'
    | 'xlarge';
  dividers?: boolean;
}

export const Stack = ({ children, space, dividers = false }: Props) => (
  <div>
    {Children.toArray(children).map((item, index) => (
      <div
        key={index}
        className={classnames(styles.gap, space !== 'none' && styles[space])}
      >
        {dividers && index > 0 ? (
          <div className={styles.gap}>
            <Divider />
          </div>
        ) : null}
        {item}
      </div>
    ))}
  </div>
);
