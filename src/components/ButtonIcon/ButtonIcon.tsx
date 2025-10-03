import type { Tooltip as BaseUITooltip } from '@base-ui-components/react';
import clsx from 'clsx';
import type { ComponentProps } from 'react';

import { Tooltip, type TooltipTrigger } from '../Tooltip/Tooltip';

import * as styles from './ButtonIcon.css';

export interface ButtonIconProps extends TooltipTrigger {
  icon: ComponentProps<typeof BaseUITooltip.Trigger>['children'];
  label: string;
  size?: keyof typeof styles.size;
  tone?: keyof typeof styles.tone;
  variant?: keyof typeof styles.variant;
  bleed?: boolean;
}
export const ButtonIcon = ({
  icon,
  label,
  size = 'medium',
  tone = 'neutral',
  variant = 'standard',
  bleed,
  ...restProps
}: ButtonIconProps) => (
  <Tooltip
    label={label}
    trigger={
      <button
        {...restProps}
        aria-label={label}
        className={clsx({
          [styles.button]: true,
          [styles.tone[tone]]: true,
          [styles.variant[variant]]: true,
          [styles.size[size]]: true,
          [styles.bleed]: bleed,
        })}
      >
        <span className={clsx(styles.content)}>{icon}</span>
      </button>
    }
  />
);
