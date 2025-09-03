import clsx from 'clsx';
import type { ElementType, AllHTMLAttributes, ReactElement } from 'react';

import * as styles from './Button.css';

interface BaseProps {
  as?: ElementType;
  tone?: 'positive' | 'critical';
  icon?: ReactElement;
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
  icon,
  tone,
  ...props
}: Props) => (
  <ButtonComponent
    className={clsx(styles.reset, styles.base, {
      [styles.positive]: tone === 'positive',
      [styles.critical]: tone === 'critical',
    })}
    disabled={tone === 'positive'}
    {...props}
  >
    {children}
    {icon ? <span className={styles.iconContainer}>{icon}</span> : null}
  </ButtonComponent>
);
