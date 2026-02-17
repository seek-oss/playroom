import clsx from 'clsx';
import { forwardRef } from 'react';

import type { ButtonIconProps } from '../ButtonIcon/ButtonIcon';
import { Tooltip, type TooltipTrigger } from '../Tooltip/Tooltip';

import * as styles from './FrameActionButton.css';

interface FrameActionButtonProps extends TooltipTrigger {
  icon: ButtonIconProps['icon'];
  label: ButtonIconProps['label'];
  tone?: keyof typeof styles.tone;
}

// Todo - consolidate with ButtonIcon if possible
export const FrameActionButton = forwardRef<
  HTMLButtonElement,
  FrameActionButtonProps
>(
  (
    { icon, label, tone = 'accent', ...restProps }: FrameActionButtonProps,
    ref
  ) => (
    <Tooltip
      label={label}
      trigger={
        <button
          {...restProps}
          type="button"
          ref={ref}
          className={clsx(styles.button, styles.tone[tone])}
          aria-label={label}
        >
          {icon}
        </button>
      }
    />
  )
);
