import React, { ReactChild } from 'react';
import classnames from 'classnames';
import TickIcon from '../icons/TickIcon';

import * as styles from './ToolbarItem.css';

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
    disabled={disabled}
    title={title}
    onClick={(event) => {
      event.stopPropagation();
      onClick();
    }}
  >
    <span style={{ display: 'block', position: 'relative' }}>{children}</span>
    <span
      className={classnames(styles.indicator, {
        [styles.show]: showIndicator && !success,
      })}
    />
    <span
      className={classnames(styles.successIndicator, {
        [styles.show]: success,
      })}
    >
      <TickIcon size={12} />
    </span>
  </button>
);
