import type { Tooltip as BaseUITooltip } from '@base-ui-components/react/tooltip';
import clsx from 'clsx';
import { type AllHTMLAttributes, forwardRef, type ComponentProps } from 'react';

import { Tooltip, type TooltipTrigger } from '../Tooltip/Tooltip';

import * as styles from './ButtonIcon.css';

type ButtonIconBaseProps = {
  icon: ComponentProps<typeof BaseUITooltip.Trigger>['children'];
  label: string;
  size?: keyof typeof styles.size;
  tone?: keyof typeof styles.tone;
  variant?: keyof typeof styles.variant;
  bleed?: boolean;
};
export type ButtonIconProps = TooltipTrigger & ButtonIconBaseProps;
export const ButtonIcon = forwardRef<HTMLButtonElement, ButtonIconProps>(
  (
    {
      icon,
      label,
      size = 'medium',
      tone = 'neutral',
      variant = 'standard',
      bleed,
      disabled,
      type = 'button',
      ...restProps
    },
    ref
  ) => (
    <Tooltip
      label={label}
      trigger={
        <button
          {...restProps}
          type={type}
          ref={ref}
          aria-disabled={disabled}
          aria-label={label}
          className={clsx({
            [styles.button]: true,
            [styles.tone[tone]]: true,
            [styles.size[size]]: true,
            [styles.bleed]: bleed,
          })}
        >
          <span className={clsx([styles.content, styles.variant[variant]])}>
            {icon}
          </span>
        </button>
      }
    />
  )
);

export type AnchorElementProps = Omit<
  AllHTMLAttributes<HTMLAnchorElement>,
  'style' | 'className' | 'size'
> & {
  href: string;
};
type ButtonIconLinkProps = AnchorElementProps & ButtonIconBaseProps;
export const ButtonIconLink = forwardRef<
  HTMLAnchorElement,
  ButtonIconLinkProps
>(
  (
    {
      icon,
      label,
      size = 'medium',
      tone = 'neutral',
      variant = 'standard',
      bleed,
      target,
      ...restProps
    },
    ref
  ) => (
    <Tooltip
      label={label}
      trigger={
        <a
          {...restProps}
          ref={ref}
          aria-label={label}
          target={target}
          rel={target === '_blank' ? 'noopener,noreferrer' : undefined}
          className={clsx({
            [styles.button]: true,
            [styles.tone[tone]]: true,
            [styles.size[size]]: true,
            [styles.bleed]: bleed,
          })}
        >
          <span className={clsx([styles.content, styles.variant[variant]])}>
            {icon}
          </span>
        </a>
      }
    />
  )
);
