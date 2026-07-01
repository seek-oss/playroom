import type { Tooltip as BaseUITooltip } from '@base-ui/react/tooltip';
import clsx from 'clsx';
import { type AllHTMLAttributes, forwardRef, type ComponentProps } from 'react';

import { Inline } from '../Inline/Inline';
import {
  KeyboardShortcut,
  type KeyCombination,
} from '../KeyboardShortcut/KeyboardShortcut';
import { Secondary } from '../Secondary/Secondary';
import { Tooltip, type TooltipTrigger } from '../Tooltip/Tooltip';

import * as styles from './ButtonIcon.css';

type ButtonIconBaseProps = {
  icon: ComponentProps<typeof BaseUITooltip.Trigger>['children'];
  label: string;
  size?: keyof typeof styles.size;
  tone?: keyof typeof styles.tone;
  shortcut?: KeyCombination;
  variant?: keyof typeof styles.variant;
  bleed?: boolean;
  active?: boolean;
  disabledReason?: string;
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
      shortcut,
      active,
      disabled,
      disabledReason,
      type = 'button',
      ...restProps
    },
    ref
  ) => (
    <Tooltip
      label={
        disabled && disabledReason ? (
          disabledReason
        ) : (
          <Inline space="xxsmall" nowrap>
            <span>{label}</span>
            {shortcut ? (
              <Secondary>
                <KeyboardShortcut shortcut={shortcut} hideOnMobile={false} />
              </Secondary>
            ) : null}
          </Inline>
        )
      }
      sideOffset={size === 'small' ? 4 : undefined}
      trigger={
        <button
          {...restProps}
          type={type}
          ref={ref}
          aria-disabled={disabled}
          aria-pressed={active}
          aria-label={label}
          data-active={active || undefined}
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

type AnchorElementProps = Omit<
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
      sideOffset={size === 'small' ? 4 : undefined}
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
