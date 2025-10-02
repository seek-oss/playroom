import { Tooltip as BaseUITooltip } from '@base-ui-components/react';
import { type ReactNode, useId, type ComponentProps } from 'react';

import { Text } from '../Text/Text';

import * as styles from './Tooltip.css';

export type TooltipTrigger = Exclude<
  ComponentProps<typeof BaseUITooltip.Trigger>,
  'style' | 'className' | 'render'
>;

type TooltipProps = TooltipTrigger & {
  trigger: ComponentProps<typeof BaseUITooltip.Trigger>['render'];
  label: ReactNode;
  side?: ComponentProps<typeof BaseUITooltip.Positioner>['side'];
  delay?: ComponentProps<typeof BaseUITooltip.Root>['delay'];
  announceAsDescription?: boolean;
};
export const Tooltip = ({
  label,
  trigger,
  delay,
  side,
  announceAsDescription,
  ...restProps
}: TooltipProps) => {
  const descriptionId = useId();

  return (
    <BaseUITooltip.Root delay={delay}>
      <BaseUITooltip.Trigger
        {...restProps}
        aria-describedby={announceAsDescription ? descriptionId : undefined}
        render={trigger}
      />
      <BaseUITooltip.Portal>
        <BaseUITooltip.Positioner
          side={side}
          sideOffset={8 /* vars.space.xsmall */}
        >
          <BaseUITooltip.Popup className={styles.popup} id={descriptionId}>
            <Text size="small" weight="strong">
              {label}
            </Text>
          </BaseUITooltip.Popup>
        </BaseUITooltip.Positioner>
      </BaseUITooltip.Portal>
    </BaseUITooltip.Root>
  );
};

export const SharedTooltipContext = BaseUITooltip.Provider;
