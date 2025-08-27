import { Menu as BaseUIMenu } from '@base-ui-components/react/menu';
import type { LucideIcon } from 'lucide-react';
import {
  type ComponentProps,
  createContext,
  forwardRef,
  type ReactNode,
  useContext,
} from 'react';

import { isMac } from '../../utils/formatting';
import { Text } from '../Text/Text';
import ChevronIcon from '../icons/ChevronIcon';
import TickIcon from '../icons/TickIcon';

import * as styles from './Menu.css';

export type Shortcut = string[];
const mac = isMac();
const iconSize = 16;

const wordToSymbolMap: Record<string, string> = {
  Cmd: '⌘',
  Alt: '⌥',
  Shift: '⇧',
  Up: '↑',
  Down: '↓',
};

const convertShortcutForPlatform = (shortcut: Shortcut) => {
  if (!mac) {
    return shortcut;
  }

  return shortcut.map((key) => wordToSymbolMap[key] || key);
};

export const MenuItem = ({
  onClick,
  shortcut,
  children,
  closeOnClick,
  disabled,
  icon: Icon,
}: {
  onClick: ComponentProps<typeof BaseUIMenu.Item>['onClick'];
  shortcut?: Shortcut;
  children: ComponentProps<typeof BaseUIMenu.Item>['children'];
  closeOnClick?: ComponentProps<typeof BaseUIMenu.Item>['closeOnClick'];
  disabled?: ComponentProps<typeof BaseUIMenu.Item>['disabled'];
  icon: LucideIcon;
}) => (
  <BaseUIMenu.Item
    className={styles.item}
    onClick={onClick}
    closeOnClick={closeOnClick}
    disabled={disabled}
  >
    <span className={styles.itemLeft}>
      <Icon size={iconSize} />
      {children}
    </span>
    {shortcut && (
      <span className={styles.shortcut}>
        {convertShortcutForPlatform(shortcut).map((key, index) => (
          <Text tone="secondary" key={index}>
            {key}
          </Text>
        ))}
      </span>
    )}
  </BaseUIMenu.Item>
);

export const MenuRadioGroup = BaseUIMenu.RadioGroup;

export const MenuRadioItem = ({
  value,
  children,
  icon: Icon,
}: {
  value: ComponentProps<typeof BaseUIMenu.RadioItem>['value'];
  children: ComponentProps<typeof BaseUIMenu.RadioItem>['children'];
  icon: LucideIcon;
}) => (
  <BaseUIMenu.RadioItem className={styles.fieldItem} value={value}>
    <span className={styles.itemLeft}>
      <Icon size={iconSize} />
      {children}
    </span>
    <BaseUIMenu.RadioItemIndicator className={styles.fieldItemIndicator}>
      <svg
        viewBox="0 0 24 24"
        focusable="false"
        fill="currentColor"
        width={12}
        height={12}
        role="img"
      >
        <circle
          cx="12"
          cy="12"
          r="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
        />
      </svg>
    </BaseUIMenu.RadioItemIndicator>
  </BaseUIMenu.RadioItem>
);

export const MenuCheckboxItem = ({
  checked,
  onCheckedChange,
  children,
  icon: Icon,
}: {
  checked: ComponentProps<typeof BaseUIMenu.CheckboxItem>['checked'];
  onCheckedChange: ComponentProps<
    typeof BaseUIMenu.CheckboxItem
  >['onCheckedChange'];
  children: ComponentProps<typeof BaseUIMenu.CheckboxItem>['children'];
  icon: LucideIcon;
}) => (
  <BaseUIMenu.CheckboxItem
    checked={checked}
    onCheckedChange={onCheckedChange}
    className={styles.fieldItem}
  >
    <span className={styles.itemLeft}>
      <Icon size={iconSize} />
      {children}
    </span>
    <BaseUIMenu.CheckboxItemIndicator className={styles.fieldItemIndicator}>
      <TickIcon />
    </BaseUIMenu.CheckboxItemIndicator>
  </BaseUIMenu.CheckboxItem>
);

export const MenuSeparator = () => (
  <BaseUIMenu.Separator className={styles.separator} />
);

export const MenuGroup = ({
  label,
  children,
}: {
  label: string;
  children: ComponentProps<typeof BaseUIMenu.Group>['children'];
}) => (
  <BaseUIMenu.Group>
    <BaseUIMenu.GroupLabel className={styles.menuGroupLabel}>
      {label}
    </BaseUIMenu.GroupLabel>
    {children}
  </BaseUIMenu.Group>
);

const SubMenuContext = createContext(false);

type Props = {
  trigger: ReactNode;
  align?: ComponentProps<typeof BaseUIMenu.Positioner>['align'];
  children: ComponentProps<typeof BaseUIMenu.Popup>['children'];
  disabled?: ComponentProps<typeof BaseUIMenu.SubmenuRoot>['disabled'];
  onClose?: () => void;
  icon?: LucideIcon;
};
export const Menu = forwardRef<HTMLButtonElement, Props>(
  (
    { trigger, align = 'start', children, onClose, disabled, icon: Icon },
    triggerRef
  ) => {
    const isSubMenu = useContext(SubMenuContext);
    const MenuRoot = isSubMenu ? BaseUIMenu.SubmenuRoot : BaseUIMenu.Root;
    const MenuTrigger = isSubMenu
      ? BaseUIMenu.SubmenuTrigger
      : BaseUIMenu.Trigger;

    if (disabled && !isSubMenu) {
      throw new Error("Menu cannot be disabled unless it's a submenu");
    }

    if (Icon && !isSubMenu) {
      throw new Error('Icon is only supported for a submenu');
    }

    return (
      <SubMenuContext.Provider value={true}>
        <MenuRoot
          onOpenChangeComplete={(open: boolean) => {
            if (!open && typeof onClose === 'function') {
              onClose();
            }
          }}
          disabled={disabled && isSubMenu}
        >
          <MenuTrigger
            ref={triggerRef}
            className={isSubMenu ? styles.submenuTrigger : styles.trigger}
          >
            {isSubMenu ? (
              <div className={styles.itemLeft}>
                {Icon ? <Icon size={iconSize} /> : null}
                {trigger}
              </div>
            ) : (
              trigger
            )}
            <ChevronIcon direction={isSubMenu ? 'right' : 'down'} size={12} />
          </MenuTrigger>
          <BaseUIMenu.Portal>
            <BaseUIMenu.Positioner
              align={align}
              alignOffset={-8 /* Align with the padding size of the popup */}
              sideOffset={
                isSubMenu
                  ? 10 /* Align with the padding size of the popup + gap */
                  : 8 /* Double padding size (medium) */
              }
            >
              <BaseUIMenu.Popup className={styles.popup}>
                {children}
              </BaseUIMenu.Popup>
            </BaseUIMenu.Positioner>
          </BaseUIMenu.Portal>
        </MenuRoot>
      </SubMenuContext.Provider>
    );
  }
);
