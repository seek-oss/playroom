import { Tooltip as BaseUITooltip } from '@base-ui/react/tooltip';
import { type ReactNode, useId, type ComponentProps, forwardRef } from 'react';

import { Text } from '../Text/Text';

import * as styles from './Tooltip.css';

export type TooltipTrigger = Omit<
  ComponentProps<typeof BaseUITooltip.Trigger>,
  'style' | 'className' | 'render' | 'delay'
>;

type TooltipProps = TooltipTrigger & {
  trigger: ComponentProps<typeof BaseUITooltip.Trigger>['render'];
  label: ReactNode;
  open?: ComponentProps<typeof BaseUITooltip.Root>['open'];
  side?: ComponentProps<typeof BaseUITooltip.Positioner>['side'];
  sideOffset?: ComponentProps<typeof BaseUITooltip.Positioner>['sideOffset'];
  announceAsDescription?: boolean;
  delay?: boolean;
};
export const Tooltip = forwardRef<HTMLButtonElement, TooltipProps>(
  (
    {
      label,
      trigger,
      side,
      sideOffset = 8, // vars.space.xsmall
      open,
      announceAsDescription,
      delay = false,
      ...restProps
    },
    triggerRef
  ) => {
    const descriptionId = useId();

    return (
      <BaseUITooltip.Root open={open}>
        <BaseUITooltip.Trigger
          {...restProps}
          // Todo - set delay to 0. this currently causes some tests to fail
          delay={delay ? 800 : 10}
          ref={triggerRef}
          aria-describedby={announceAsDescription ? descriptionId : undefined}
          render={trigger}
        />
        <BaseUITooltip.Portal>
          <BaseUITooltip.Positioner side={side} sideOffset={sideOffset}>
            <BaseUITooltip.Popup className={styles.popup} id={descriptionId}>
              <Text size="small" weight="strong">
                {label}
              </Text>
            </BaseUITooltip.Popup>
          </BaseUITooltip.Positioner>
        </BaseUITooltip.Portal>
      </BaseUITooltip.Root>
    );
  }
);

export const SharedTooltipContext = BaseUITooltip.Provider;
