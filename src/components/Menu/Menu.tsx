import { Menu as BaseUIMenu } from '@base-ui-components/react/menu';
import clsx from 'clsx';
import { type LucideIcon, Check } from 'lucide-react';
import {
  type AllHTMLAttributes,
  type ComponentProps,
  type ReactNode,
  createContext,
  forwardRef,
  useContext,
} from 'react';

import { isMac } from '../../utils/formatting';
import { useCopy } from '../../utils/useCopy';
import { Text } from '../Text/Text';
import ChevronIcon from '../icons/ChevronIcon';
import TickIcon from '../icons/TickIcon';

import * as styles from './Menu.css';

export type Shortcut = string[];
const mac = isMac();
export const menuIconSize = 16;

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

const SubMenuTriggerContext = createContext(false);

type MenuItemProps = Omit<
  ComponentProps<typeof BaseUIMenu.Item>,
  'render' | 'className'
> & {
  shortcut?: Shortcut;
  icon?: LucideIcon;
};
export const MenuItem = ({
  children,
  shortcut,
  icon: Icon,
  disabled,
  ...restProps
}: MenuItemProps) => {
  const isSubMenuTrigger = useContext(SubMenuTriggerContext);

  return (
    <BaseUIMenu.Item className={styles.item} disabled={disabled} {...restProps}>
      <span className={styles.itemLeft}>
        {Icon ? <Icon size={menuIconSize} /> : null}
        <Text tone={disabled ? 'secondary' : undefined}>{children}</Text>
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
      {isSubMenuTrigger ? <ChevronIcon direction="right" size={12} /> : null}
    </BaseUIMenu.Item>
  );
};

type MenuItemLinkProps = MenuItemProps &
  AllHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };
export const MenuItemLink = ({
  children,
  shortcut,
  icon: Icon,
  href,
  target,
  ...restProps
}: MenuItemLinkProps) => {
  const isSubMenuTrigger = useContext(SubMenuTriggerContext);

  return (
    <BaseUIMenu.Item
      render={
        <a
          href={href}
          className={styles.itemLink}
          target={target}
          rel={target === '_blank' ? 'noopener,noreferrer' : undefined}
        >
          <span className={styles.itemLeft}>
            {Icon ? <Icon size={menuIconSize} /> : null}
            <Text>{children}</Text>
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
          {isSubMenuTrigger ? (
            <ChevronIcon direction="right" size={12} />
          ) : null}
        </a>
      }
      {...restProps}
    />
  );
};

export const MenuRadioGroup = BaseUIMenu.RadioGroup;

export const MenuRadioItem = ({
  value,
  children,
  icon: Icon,
}: {
  value: ComponentProps<typeof BaseUIMenu.RadioItem>['value'];
  children: ComponentProps<typeof BaseUIMenu.RadioItem>['children'];
  icon?: LucideIcon;
}) => (
  <BaseUIMenu.RadioItem className={styles.fieldItem} value={value}>
    <span className={styles.itemLeft}>
      {Icon ? <Icon size={menuIconSize} /> : null}
      <Text>{children}</Text>
    </span>
    <BaseUIMenu.RadioItemIndicator className={styles.radioItemIndicator}>
      <Check size={menuIconSize} />
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
  icon?: LucideIcon;
}) => (
  <BaseUIMenu.CheckboxItem
    checked={checked}
    onCheckedChange={onCheckedChange}
    className={styles.fieldItem}
  >
    <span className={styles.itemLeft}>
      {Icon ? <Icon size={menuIconSize} /> : null}
      <Text>{children}</Text>
    </span>
    <span className={styles.checkboxBox}>
      <BaseUIMenu.CheckboxItemIndicator
        className={styles.checkboxItemIndicator}
      >
        <TickIcon size={12} />
      </BaseUIMenu.CheckboxItemIndicator>
    </span>
  </BaseUIMenu.CheckboxItem>
);

export const MenuSeparator = () => (
  <BaseUIMenu.Separator className={styles.separator} />
);

export const MenuGroup = ({
  label,
  children,
  action,
}: {
  label: string;
  children: ComponentProps<typeof BaseUIMenu.Group>['children'];
  action?: ComponentProps<typeof BaseUIMenu.Group>['children'];
}) => (
  <BaseUIMenu.Group>
    <BaseUIMenu.GroupLabel className={styles.menuGroupLabel}>
      <Text weight="strong">{label}</Text>
      {action}
    </BaseUIMenu.GroupLabel>
    {children}
  </BaseUIMenu.Group>
);

const SubMenuContext = createContext(false);

type Props = {
  trigger: ComponentProps<typeof BaseUIMenu.Trigger>['render'];
  width: 'content' | 'small';
  align?: ComponentProps<typeof BaseUIMenu.Positioner>['align'];
  children: ComponentProps<typeof BaseUIMenu.Popup>['children'];
  disabled?: ComponentProps<typeof BaseUIMenu.SubmenuRoot>['disabled'];
  onOpenChange?: ComponentProps<typeof BaseUIMenu.Root>['onOpenChange'];
  onClose?: () => void;
};
export const Menu = forwardRef<HTMLButtonElement, Props>(
  (
    {
      trigger,
      align = 'start',
      width = 'content',
      children,
      onClose,
      onOpenChange,
      disabled,
    },
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

    return (
      <SubMenuContext.Provider value={true}>
        <MenuRoot
          onOpenChange={onOpenChange}
          onOpenChangeComplete={(open: boolean) => {
            if (!open && typeof onClose === 'function') {
              onClose();
            }
          }}
          disabled={disabled && isSubMenu}
        >
          <SubMenuTriggerContext.Provider value={true}>
            <MenuTrigger ref={triggerRef} render={trigger} />
          </SubMenuTriggerContext.Provider>
          <BaseUIMenu.Portal>
            <BaseUIMenu.Positioner
              align={align}
              alignOffset={isSubMenu ? -4 : 0}
              sideOffset={isSubMenu ? 0 : 6}
            >
              <BaseUIMenu.Popup
                className={clsx({
                  [styles.popup]: true,
                  [styles.small]: width === 'small',
                })}
              >
                {children}
              </BaseUIMenu.Popup>
            </BaseUIMenu.Positioner>
          </BaseUIMenu.Portal>
        </MenuRoot>
      </SubMenuContext.Provider>
    );
  }
);

type MenuCopyItemProps = {
  content: string;
  children: ReactNode;
};

export const MenuCopyItem = ({ content, children }: MenuCopyItemProps) => {
  const { copying, onCopyClick } = useCopy();

  return (
    <BaseUIMenu.Item
      className={clsx({ [styles.item]: true, [styles.positive]: copying })}
      closeOnClick={false}
      onClick={() => onCopyClick(content)}
    >
      <span className={styles.itemLeft}>
        {copying ? (
          <>
            <Text tone="positive">Copied</Text>
            <TickIcon size={menuIconSize} />
          </>
        ) : (
          <Text>{children}</Text>
        )}
      </span>
    </BaseUIMenu.Item>
  );
};

type MenuClearItemProps = Omit<
  ComponentProps<typeof BaseUIMenu.Item>,
  'render' | 'className'
>;
export const MenuClearItem = ({
  onClick,
  children,
  ...restProps
}: MenuClearItemProps) => (
  <BaseUIMenu.Item
    {...restProps}
    className={styles.clearItem}
    closeOnClick={false}
    onClick={onClick}
  >
    <Text tone="secondary" size="small">
      {children}
    </Text>
  </BaseUIMenu.Item>
);
