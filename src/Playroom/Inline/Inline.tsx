import React, { ReactElement, Children } from 'react';
import classnames from 'classnames';

// @ts-ignore
import styles from './Inline.less';

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

export const Inline = ({ children, space }: Props) => {
  const items = Children.toArray(children);

  const itemSizeClass = classnames({
    [styles.xxsmall]: space === 'xxsmall',
    [styles.xsmall]: space === 'xsmall',
    [styles.small]: space === 'small',
    [styles.medium]: space === 'medium',
    [styles.large]: space === 'large',
    [styles.xlarge]: space === 'xlarge',
  });

  return (
    <div className={classnames(styles.root, itemSizeClass)}>
      {items.map((item, index) => (
        <div
          key={index}
          className={classnames(styles.inlineItem, itemSizeClass)}
        >
          {item}
        </div>
      ))}
    </div>
  );
};
