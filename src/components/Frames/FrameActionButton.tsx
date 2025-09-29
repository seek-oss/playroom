import { Tooltip } from '@base-ui-components/react';
import clsx from 'clsx';
import type { ComponentProps } from 'react';

import { Text } from '../Text/Text';

import * as styles from './FrameActionButton.css';

interface FrameActionButtonProps
  extends Omit<ComponentProps<typeof Tooltip.Trigger>, 'style' | 'className'> {
  icon: ComponentProps<typeof Tooltip.Trigger>['children'];
  label: string;
  size?: keyof typeof styles.size;
  tone?: keyof typeof styles.tone;
}

// Todo - consolidate with ButtonIcon if possible
export const FrameActionButton = ({
  icon,
  label,
  size = 'medium',
  tone = 'neutral',
  ...restProps
}: FrameActionButtonProps) => (
  <Tooltip.Root>
    <Tooltip.Trigger
      {...restProps}
      aria-label={label}
      className={clsx(styles.button, styles.size[size], styles.tone[tone])}
    >
      {icon}
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Positioner sideOffset={12 /* vars.space.small */}>
        <Tooltip.Popup className={styles.popup}>
          <Text size="small">{label}</Text>
        </Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>
);
