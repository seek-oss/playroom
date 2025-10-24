import { ContextMenu as BaseUIContextMenu } from '@base-ui-components/react';
import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

import { menuIconSize } from '../Menu/Menu';
import { Text } from '../Text/Text';

import * as styles from './ContextMenu.css';
import * as menuStyles from '../Menu/Menu.css';

export const ContextMenuItem = ({
  onClick,
  children,
  closeOnClick,
  disabled,
  tone = 'neutral',
  icon: Icon,
  active = true,
}: {
  onClick: ComponentProps<typeof BaseUIContextMenu.Item>['onClick'];
  children: ComponentProps<typeof BaseUIContextMenu.Item>['children'];
  closeOnClick?: ComponentProps<typeof BaseUIContextMenu.Item>['closeOnClick'];
  disabled?: ComponentProps<typeof BaseUIContextMenu.Item>['disabled'];
  tone?: 'neutral' | 'critical' | 'positive';
  icon?: LucideIcon;
  active?: boolean;
}) => (
  <BaseUIContextMenu.Item
    className={clsx({
      [menuStyles.item]: true,
      [menuStyles.critical]: tone === 'critical',
    })}
    onClick={onClick}
    closeOnClick={closeOnClick}
    disabled={disabled}
    style={!active ? { pointerEvents: 'none' } : undefined}
  >
    <span className={menuStyles.itemLeft}>
      {Icon ? <Icon size={menuIconSize} /> : null}
      <Text tone={tone}>{children}</Text>
    </span>
  </BaseUIContextMenu.Item>
);

export const ContextMenuSeparator = () => (
  <BaseUIContextMenu.Separator className={menuStyles.separator} />
);

type Props = {
  trigger: ComponentProps<typeof BaseUIContextMenu.Trigger>['render'];
  align?: ComponentProps<typeof BaseUIContextMenu.Positioner>['align'];
  children: ComponentProps<typeof BaseUIContextMenu.Popup>['children'];
  onOpenChange?: ComponentProps<typeof BaseUIContextMenu.Root>['onOpenChange'];
};
export const ContextMenu = ({
  trigger,
  align = 'start',
  children,
  onOpenChange,
}: Props) => (
  <BaseUIContextMenu.Root onOpenChange={onOpenChange}>
    <BaseUIContextMenu.Trigger render={trigger} />
    <BaseUIContextMenu.Portal>
      <BaseUIContextMenu.Positioner align={align}>
        <BaseUIContextMenu.Popup
          className={clsx(menuStyles.popup, styles.contextMenu)}
        >
          {children}
        </BaseUIContextMenu.Popup>
      </BaseUIContextMenu.Positioner>
    </BaseUIContextMenu.Portal>
  </BaseUIContextMenu.Root>
);
