import React, { ElementType, AllHTMLAttributes } from 'react';
import classnames from 'classnames';

// @ts-ignore
import styles from './ShareButton.less';

interface BaseProps {
  as?: ElementType;
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
  children,
  onClick,
  href,
  'data-testid': dataTestId
}: Props) => (
  <ButtonComponent
    className={classnames(styles.buttonReset, styles.variant)}
    onClick={onClick}
    href={href}
    data-testid={dataTestId}
  >
    {children}
  </ButtonComponent>
);
