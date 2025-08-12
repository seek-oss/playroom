import { Popover as BaseUIPopover } from '@base-ui-components/react';
import type { ComponentProps } from 'react';

import * as styles from './Popover.css';

interface Props {
  'aria-label': string;
  trigger?: ComponentProps<typeof BaseUIPopover.Trigger>['render'];
  anchor?: ComponentProps<typeof BaseUIPopover.Positioner>['anchor'];
  open?: ComponentProps<typeof BaseUIPopover.Root>['open'];
  align?: ComponentProps<typeof BaseUIPopover.Positioner>['align'];
  children: ComponentProps<typeof BaseUIPopover.Popup>['children'];
}

export const Popover = ({
  trigger,
  'aria-label': ariaLabel,
  anchor,
  open,
  align,
  children,
  ...restProps
}: Props) => {
  console.log(anchor);
  return (
    <BaseUIPopover.Root open={open}>
      {trigger ? (
        <BaseUIPopover.Trigger {...restProps} render={trigger} />
      ) : null}
      <BaseUIPopover.Portal>
        <BaseUIPopover.Positioner
          sideOffset={8}
          className={styles.positioner}
          align={align}
          anchor={anchor}
        >
          <BaseUIPopover.Popup className={styles.popup} aria-label={ariaLabel}>
            {children}
          </BaseUIPopover.Popup>
        </BaseUIPopover.Positioner>
      </BaseUIPopover.Portal>
    </BaseUIPopover.Root>
  );
};
