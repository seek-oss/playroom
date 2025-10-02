import clsx from 'clsx';

import type { ButtonIconProps } from '../ButtonIcon/ButtonIcon';
import { Tooltip } from '../Tooltip/Tooltip';

import * as styles from './FrameActionButton.css';

interface FrameActionButtonProps {
  icon: ButtonIconProps['icon'];
  label: ButtonIconProps['label'];
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
  <Tooltip
    label={label}
    trigger={
      <button
        {...restProps}
        className={clsx(styles.button, styles.size[size], styles.tone[tone])}
      >
        {icon}
      </button>
    }
  />
);
