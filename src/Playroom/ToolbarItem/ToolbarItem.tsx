import type { ReactChild } from 'react';
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
}

export default ({
  children,
  title,
  active = false,
  disabled = false,
  showIndicator = false,
  success = false,
  onClick,
}: Props) => (
  <button
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
    {children}
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
