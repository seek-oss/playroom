import React, { ReactChild } from 'react';
import classnames from 'classnames';

// @ts-ignore
import styles from './ToolbarItem.less';
import TickIcon from '../icons/TickIcon';

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
  ['data-testid']: dataTestId
}: Props) => (
  <button
    data-testid={dataTestId}
    className={classnames(styles.button, {
      [styles.button_isActive]: active,
      [styles.showIndicator]: showIndicator,
      [styles.disabled]: disabled,
      [styles.success]: success
    })}
    title={title}
    onClick={event => {
      event.stopPropagation();
      onClick();
    }}
  >
    {children}
    <div
      className={classnames(styles.indicator, {
        [styles.show]: showIndicator || success
      })}
    >
      {success ? <TickIcon size={14} /> : undefined}
    </div>
  </button>
);
