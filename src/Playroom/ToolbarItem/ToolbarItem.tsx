import React, { ReactChild } from 'react';
import classnames from 'classnames';
import { Text } from '../Text/Text';

// @ts-ignore
import styles from './ToolbarItem.less';

interface Props {
  children: ReactChild;
  active?: boolean;
  title: string;
  showIndicator?: boolean;
  statusMessage?: string;
  statusMessageTone?: 'neutral' | 'positive' | 'critical';
  showStatus?: boolean;
  onClick: () => void;
  ['data-testid']?: string;
}
export default ({
  children,
  active = false,
  title,
  showIndicator = false,
  statusMessage,
  statusMessageTone = 'neutral',
  showStatus = false,
  onClick,
  ['data-testid']: dataTestId
}: Props) => (
  <div
    className={classnames(styles.root, {
      [styles.showIndicator]: showIndicator
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
        [styles.show]: showIndicator
      })}
    />
    {statusMessage && (
      <div
        className={classnames(styles.status, {
          [styles.neutral]: statusMessageTone === 'neutral',
          [styles.positive]: statusMessageTone === 'positive',
          [styles.critical]: statusMessageTone === 'critical',
          [styles.status_show]: showStatus && statusMessage // eslint-disable-line css-modules/no-undef-class
        })}
      >
        <Text>{statusMessage}</Text>
      </div>
    )}
  </div>
);
