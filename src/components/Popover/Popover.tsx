import { Popover as BaseUIPopover } from '@base-ui-components/react';
import type { ComponentProps } from 'react';

import * as styles from './Popover.css';

interface Props {
  'aria-label': string;
  trigger: ComponentProps<typeof BaseUIPopover.Trigger>['render'];
  children: ComponentProps<typeof BaseUIPopover.Popup>['children'];
  open?: ComponentProps<typeof BaseUIPopover.Root>['open'];
  onOpenChange?: ComponentProps<typeof BaseUIPopover.Root>['onOpenChange'];
  initialFocus?: ComponentProps<typeof BaseUIPopover.Popup>['initialFocus'];
  anchor?: ComponentProps<typeof BaseUIPopover.Positioner>['anchor'];
  align?: ComponentProps<typeof BaseUIPopover.Positioner>['align'];
  side?: ComponentProps<typeof BaseUIPopover.Positioner>['side'];
  size?: keyof typeof styles.size;
}

export type PopoverTrigger = ComponentProps<typeof BaseUIPopover.Trigger>;

export const Popover = ({
  'aria-label': ariaLabel,
  trigger,
  anchor,
  open,
  onOpenChange,
  initialFocus,
  align,
  side,
  children,
  size,
}: Props) => (
  <BaseUIPopover.Root open={open} onOpenChange={onOpenChange}>
    <BaseUIPopover.Trigger render={trigger} />
    <BaseUIPopover.Portal>
      <BaseUIPopover.Positioner
        sideOffset={10}
        align={align}
        side={side}
        anchor={anchor}
        positionMethod="fixed"
      >
        <BaseUIPopover.Popup
          className={styles.size[size || 'medium']}
          aria-label={ariaLabel}
          initialFocus={initialFocus}
        >
          {children}
        </BaseUIPopover.Popup>
      </BaseUIPopover.Positioner>
    </BaseUIPopover.Portal>
  </BaseUIPopover.Root>
);
