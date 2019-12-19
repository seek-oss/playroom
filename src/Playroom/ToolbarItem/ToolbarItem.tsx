import React, { ReactChild } from 'react';
import classnames from 'classnames';

// @ts-ignore
import styles from './ToolbarItem.less';

interface Props {
  children: ReactChild;
  active?: boolean;
  title: string;
  count?: number;
  onClick: () => void;
}
export default ({
  children,
  active = false,
  title,
  count = 0,
  onClick
}: Props) => {
  const hasSelection = count > 0;

  return (
    <div
      className={classnames(styles.root, {
        [styles.hasSelection]: hasSelection
      })}
    >
      <button
        className={classnames(styles.button, {
          [styles.button_isActive]: active
        })}
        title={title}
        onClick={event => {
          event.stopPropagation();
          onClick();
        }}
      >
        {children}
      </button>
      <div
        className={classnames(styles.indicator, {
          [styles.show]: hasSelection
        })}
      >
        {count || ''}
      </div>
    </div>
  );
};
