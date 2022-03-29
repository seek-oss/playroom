import React, { ElementType, AllHTMLAttributes, ReactElement } from 'react';
import classnames from 'classnames';

import * as styles from './Button.css';

interface BaseProps {
  as?: ElementType;
  tone?: 'positive';
  icon?: ReactElement;
  'data-testid'?: string;
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
    className={classnames(styles.reset, styles.base, {
      [styles.positive]: tone === 'positive',
    })}
    disabled={tone === 'positive'}
    {...props}
  >
    {children}
    {icon ? <span className={styles.iconContainer}>{icon}</span> : null}
  </ButtonComponent>
);
