import React, { ReactChild } from 'react';
import classnames from 'classnames';
import TickIcon from '../icons/TickIcon';

// @ts-ignore
import styles from './ToolbarItem.less';

interface Props {
  children: ReactChild;
  title: string;
  active?: boolean;
  success?: boolean;
  disabled?: boolean;
  showIndicator?: boolean;
  onClick: () => void;
  ['data-testid']?: string;
}

export default ({
  children,
  title,
  active = false,
  disabled = false,
  showIndicator = false,
  success = false,
  onClick,
  ['data-testid']: dataTestId,
}: Props) => (
  <button
    data-testid={dataTestId}
    className={classnames(styles.button, {
      [styles.button_isActive]: active,
      [styles.showIndicator]: showIndicator,
      [styles.disabled]: disabled,
      [styles.success]: success,
    })}
    title={title}
    onClick={(event) => {
      event.stopPropagation();
      onClick();
    }}
  >
    {children}
    <div
      className={classnames(styles.indicator, {
        [styles.show]: showIndicator && !success,
      })}
    />
    <div
      className={classnames(styles.successIndicator, {
        [styles.show]: success,
      })}
    >
      <TickIcon size={12} />
    </div>
  </button>
);
