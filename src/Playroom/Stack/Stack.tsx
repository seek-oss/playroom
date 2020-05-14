import React, { ReactElement, Children } from 'react';
import classnames from 'classnames';

import { Divider } from '../Divider/Divider';

// @ts-ignore
import styles from './Stack.less';

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

export const Stack = ({ children, space, dividers = false }: Props) => {
  const stackItems = Children.toArray(children);

  const stackItemSizeClass = classnames({
    [styles.xxsmall]: space === 'xxsmall',
    [styles.xsmall]: space === 'xsmall',
    [styles.small]: space === 'small',
    [styles.medium]: space === 'medium',
    [styles.large]: space === 'large',
    [styles.xlarge]: space === 'xlarge',
  });

  return (
    <div>
      {stackItems.map((item, index) => (
        <div
          key={index}
          className={classnames(styles.stackItem, stackItemSizeClass)}
        >
          {dividers && index > 0 ? (
            <div className={classnames(styles.divider, stackItemSizeClass)}>
              <Divider />
            </div>
          ) : null}
          {item}
        </div>
      ))}
    </div>
  );
};
