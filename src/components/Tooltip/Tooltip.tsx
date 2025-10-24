import { Tooltip as BaseUITooltip } from '@base-ui-components/react';
import { type ReactNode, useId, type ComponentProps, forwardRef } from 'react';

import { Text } from '../Text/Text';

import * as styles from './Tooltip.css';

export type TooltipTrigger = Exclude<
  ComponentProps<typeof BaseUITooltip.Trigger>,
  'style' | 'className' | 'render'
>;

type TooltipProps = TooltipTrigger & {
  trigger: ComponentProps<typeof BaseUITooltip.Trigger>['render'];
  label: ReactNode;
  open?: ComponentProps<typeof BaseUITooltip.Root>['open'];
  side?: ComponentProps<typeof BaseUITooltip.Positioner>['side'];
  sideOffset?: ComponentProps<typeof BaseUITooltip.Positioner>['sideOffset'];
  announceAsDescription?: boolean;
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
      ...restProps
    },
    triggerRef
  ) => {
    const descriptionId = useId();

    return (
      // Todo - set delay to 0. this currently causes some tests to fail
      <BaseUITooltip.Root delay={10} open={open}>
        <BaseUITooltip.Trigger
          {...restProps}
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
