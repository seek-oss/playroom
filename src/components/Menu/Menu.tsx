import { Menu as BaseUIMenu } from '@base-ui-components/react/menu';
import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';
import {
  type AllHTMLAttributes,
  type ComponentProps,
  type ReactNode,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useState,
} from 'react';

import { isMac } from '../../utils/formatting';
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
  icon: LucideIcon;
};
export const MenuItem = ({
  children,
  shortcut,
  icon: Icon,
  ...restProps
}: MenuItemProps) => {
  const isSubMenuTrigger = useContext(SubMenuTriggerContext);

  return (
    <BaseUIMenu.Item className={styles.item} {...restProps}>
      <span className={styles.itemLeft}>
        <Icon size={menuIconSize} />
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
            <Icon size={menuIconSize} />
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
  icon: LucideIcon;
}) => (
  <BaseUIMenu.RadioItem className={styles.fieldItem} value={value}>
    <span className={styles.itemLeft}>
      <Icon size={menuIconSize} />
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
      <Icon size={menuIconSize} />
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
              alignOffset={
                -4 /* Align with the edge of the popup corner radius (half of medium) */
              }
              sideOffset={
                isSubMenu
                  ? 10 /* Align with the padding size of the popup + gap */
                  : 8 /* Double padding size (medium) */
              }
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
  onCopy: () => void;
  children: ReactNode;
  resetMs?: number;
};

export const MenuCopyItem = ({
  onCopy,
  children,
  resetMs = 1200,
}: MenuCopyItemProps) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timer = setTimeout(() => setCopied(false), resetMs);

    return () => clearTimeout(timer);
  }, [copied, resetMs]);

  return (
    <BaseUIMenu.Item
      className={clsx({ [styles.item]: true, [styles.positive]: copied })}
      closeOnClick={false}
      onClick={() => {
        onCopy();
        setCopied(true);
      }}
    >
      <span className={styles.itemLeft}>
        {copied ? (
          <>
            <TickIcon size={menuIconSize} />
            <Text tone="positive">Copied</Text>
          </>
        ) : (
          <>{children}</>
        )}
      </span>
    </BaseUIMenu.Item>
  );
};
