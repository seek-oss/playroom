import React, { ReactChild } from 'react';
import classnames from 'classnames';

// @ts-ignore
import styles from './ToolbarItem.less';

interface Props {
  children: ReactChild;
  active?: boolean;
  title: string;
  count?: number;
  statusMessage?: string;
  showStatus?: boolean;
  onClick: () => void;
  ['data-testid']?: string;
}
export default ({
  children,
  active = false,
  title,
  count = 0,
  statusMessage,
  showStatus = false,
  onClick,
  ['data-testid']: dataTestId
}: Props) => {
  const hasSelection = count > 0;

  return (
    <div
      className={classnames(styles.root, {
        [styles.hasSelection]: hasSelection
      })}
    >
      <button
        data-testid={dataTestId}
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
      {statusMessage && (
        <div
          className={classnames(styles.status, {
            [styles.status_show]: showStatus && statusMessage // eslint-disable-line css-modules/no-undef-class
          })}
        >
          {statusMessage}
        </div>
      )}
    </div>
  );
};
