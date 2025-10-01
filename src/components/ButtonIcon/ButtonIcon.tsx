import { Tooltip } from '@base-ui-components/react';
import clsx from 'clsx';
import type { ComponentProps } from 'react';

import { Text } from '../Text/Text';

import * as styles from './ButtonIcon.css';

type TriggerNoStyles = Exclude<
  ComponentProps<typeof Tooltip.Trigger>,
  'style' | 'className'
>;

interface Props extends TriggerNoStyles {
  icon: ComponentProps<typeof Tooltip.Trigger>['children'];
  label: string;
  size?: keyof typeof styles.size;
  tone?: keyof typeof styles.tone;
  variant?: keyof typeof styles.variant;
}
export const ButtonIcon = ({
  icon,
  label,
  size = 'medium',
  tone = 'neutral',
  variant = 'standard',
  ...restProps
}: Props) => (
  <Tooltip.Root delay={0}>
    <Tooltip.Trigger
      {...restProps}
      aria-label={label}
      className={clsx(styles.button, styles.variant[variant])}
    >
      <span
        className={clsx(
          styles.content,
          styles.size[size],
          styles.tone[tone],
          styles.variant[variant]
        )}
      >
        {icon}
      </span>
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Positioner sideOffset={12 /* vars.space.small */}>
        <Tooltip.Popup className={styles.popup}>
          <Text size="small" weight="strong">
            {label}
          </Text>
        </Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>
);
