import React, { ElementType, AllHTMLAttributes, ReactElement } from 'react';
import classnames from 'classnames';

// @ts-ignore
import styles from './ShareButton.less';

interface BaseProps {
  slim?: boolean;
  as?: ElementType;
  tone?: 'positive' | 'critical';
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

export const ShareButton = ({
  as: ButtonComponent = 'button',
  slim = false,
  children,
  icon,
  tone,
  ...props
}: Props) => (
  <ButtonComponent
    className={classnames(styles.buttonReset, styles.variant, {
      [styles.slim]: slim,
      [styles.positive]: tone === 'positive'
    })}
    {...props}
  >
    {children}
    {icon ? <span className={styles.iconContainer}>{icon}</span> : null}
  </ButtonComponent>
);
