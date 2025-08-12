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
}
export const ButtonIcon = ({
  icon,
  label,
  size = 'medium',
  ...restProps
}: Props) => (
  <Tooltip.Root>
    <Tooltip.Trigger
      {...restProps}
      aria-label={label}
      className={clsx(styles.button, styles.size[size])}
    >
      {icon}
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Positioner sideOffset={14} className={styles.postioner}>
        <Tooltip.Popup className={styles.popup}>
          <Text>{label}</Text>
        </Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>
);
