import clsx from 'clsx';
import type { AllHTMLAttributes, ElementType } from 'react';

import { Text } from '../Text/Text';

import * as styles from './Button.css';

interface BaseProps {
  as?: ElementType;
  tone?: keyof typeof styles.tone;
  size?: keyof typeof styles.size;
  height?: 'explicit' | 'content';
}

interface ButtonProps
  extends Omit<AllHTMLAttributes<HTMLButtonElement>, 'as' | 'size' | 'height'>,
    BaseProps {}

interface LinkProps
  extends Omit<AllHTMLAttributes<HTMLAnchorElement>, 'as' | 'size' | 'height'>,
    BaseProps {}

type Props = ButtonProps | LinkProps;

export const Button = ({
  as: ButtonComponent = 'button',
  children,
  tone,
  size = 'medium',
  height = 'explicit',
  ...props
}: Props) => (
  <ButtonComponent
    className={clsx({
      [styles.base]: true,
      [styles.tone[tone!]]: tone,
      [styles.size[size]]: size,
      [styles.height[height!]]: height,
    })}
    disabled={tone === 'positive'}
    {...props}
  >
    <Text
      weight="strong"
      tone={tone}
      size={size !== 'medium' ? size : undefined}
      truncate
    >
      {children}
    </Text>
  </ButtonComponent>
);
