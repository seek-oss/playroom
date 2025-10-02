import clsx from 'clsx';

import type { ButtonIconProps } from '../ButtonIcon/ButtonIcon';
import { Tooltip, type TooltipTrigger } from '../Tooltip/Tooltip';

import * as styles from './FrameActionButton.css';

interface FrameActionButtonProps extends TooltipTrigger {
  icon: ButtonIconProps['icon'];
  label: ButtonIconProps['label'];
  tone?: keyof typeof styles.tone;
}

// Todo - consolidate with ButtonIcon if possible
export const FrameActionButton = ({
  icon,
  label,
  tone = 'accent',
  ...restProps
}: FrameActionButtonProps) => (
  <Tooltip
    label={label}
    trigger={
      <button {...restProps} className={clsx(styles.button, styles.tone[tone])}>
        {icon}
      </button>
    }
  />
);
