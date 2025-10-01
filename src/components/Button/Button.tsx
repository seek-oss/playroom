import clsx from 'clsx';
import type { AllHTMLAttributes, ElementType } from 'react';

import { Text } from '../Text/Text';

import * as styles from './Button.css';

interface BaseProps {
  as?: ElementType;
  tone?: 'positive' | 'critical';
}

interface ButtonProps
  extends Omit<AllHTMLAttributes<HTMLButtonElement>, 'as'>,
    BaseProps {}

interface LinkProps
  extends Omit<AllHTMLAttributes<HTMLAnchorElement>, 'as'>,
    BaseProps {}

type Props = ButtonProps | LinkProps;

export const Button = ({
  as: ButtonComponent = 'button',
  children,
  tone,
  ...props
}: Props) => (
  <ButtonComponent
    className={clsx(
      styles.reset,
      styles.base,
      tone ? styles.tone[tone] : undefined
    )}
    disabled={tone === 'positive'}
    {...props}
  >
    <Text weight="strong" tone={tone}>
      {children}
    </Text>
  </ButtonComponent>
);
