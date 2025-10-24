import { Menu as BaseUIMenu } from '@base-ui-components/react/menu';
import clsx from 'clsx';
import { type LucideIcon, ArrowUpRight, Check } from 'lucide-react';
import {
  type AllHTMLAttributes,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
  createContext,
  forwardRef,
  useContext,
} from 'react';

import { useCopy } from '../../utils/useCopy';
import {
  KeyboardShortcut,
  type KeyCombination,
} from '../KeyboardShortcut/KeyboardShortcut';
import { ScrollContainer } from '../ScrollContainer/ScrollContainer';
import { Text } from '../Text/Text';
import { Tooltip } from '../Tooltip/Tooltip';
import ChevronIcon from '../icons/ChevronIcon';
import TickIcon from '../icons/TickIcon';

import * as styles from './Menu.css';

export const menuIconSize = 16;

const SubMenuTriggerContext = createContext(false);

type MenuItemProps = Omit<
  ComponentProps<typeof BaseUIMenu.Item>,
  'render' | 'className'
> & {
  shortcut?: KeyCombination;
  icon?: LucideIcon;
  disabledReason?: string;
};
export const MenuItem = ({
  children,
  shortcut,
  icon: Icon,
  disabled,
  disabledReason,
  ...restProps
}: MenuItemProps) => {
  const isSubMenuTrigger = useContext(SubMenuTriggerContext);

  const item = (
    <BaseUIMenu.Item
      className={styles.item}
      disabled={disabled}
      closeOnClick={isSubMenuTrigger ? false : undefined}
      {...restProps}
    >
      <span className={styles.itemLeft}>
        {Icon ? <Icon size={menuIconSize} /> : null}
        <Text tone={disabled ? 'secondary' : undefined} truncate>
          {children}
        </Text>
      </span>
      {shortcut && (
        <Text tone="secondary">
          <KeyboardShortcut shortcut={shortcut} />
        </Text>
      )}
      {isSubMenuTrigger && !disabled ? (
        <ChevronIcon direction="right" size={12} />
      ) : null}
    </BaseUIMenu.Item>
  );

  return disabled && disabledReason ? (
    <Tooltip
      label={disabledReason}
      announceAsDescription
      side="right"
      trigger={item}
    />
  ) : (
    item
  );
};

export const linkArrowSize = 12;

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
  disabled,
  disabledReason,
  ...restProps
}: MenuItemLinkProps) => {
  const isSubMenuTrigger = useContext(SubMenuTriggerContext);

  const item = (
    <BaseUIMenu.Item
      disabled={disabled}
      render={
        <a
          href={disabled ? undefined : href}
          className={styles.itemLink}
          target={target}
          rel={target === '_blank' ? 'noopener,noreferrer' : undefined}
          role="link"
        >
          <span className={styles.itemLeft}>
            {Icon ? <Icon size={menuIconSize} /> : null}

            <Text tone={disabled ? 'secondary' : undefined} truncate>
              {children}
              {target === '_blank' && !disabled ? (
                <ArrowUpRight
                  height={linkArrowSize}
                  width={linkArrowSize}
                  className={styles.externalLink}
                />
              ) : null}
            </Text>
          </span>
          {shortcut && (
            <Text tone="secondary">
              <KeyboardShortcut shortcut={shortcut} />
            </Text>
          )}
          {isSubMenuTrigger && !disabled ? (
            <ChevronIcon direction="right" size={12} />
          ) : null}
        </a>
      }
      {...restProps}
    />
  );

  return disabled && disabledReason ? (
    <Tooltip
      label={disabledReason}
      announceAsDescription
      side="right"
      trigger={item}
    />
  ) : (
    item
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
      <Text truncate>{children}</Text>
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
      <Text truncate>{children}</Text>
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
      <Text tone="secondary" truncate>
        {label}
      </Text>
      {action}
    </BaseUIMenu.GroupLabel>
    {children}
  </BaseUIMenu.Group>
);

const SubMenuContext = createContext(false);

type Props = {
  trigger: NonNullable<ComponentProps<typeof BaseUIMenu.Trigger>['render']>;
  width: 'content' | 'small';
  align?: ComponentProps<typeof BaseUIMenu.Positioner>['align'];
  children: ComponentProps<typeof BaseUIMenu.Popup>['children'];
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
    },
    triggerRef
  ) => {
    const isSubMenu = useContext(SubMenuContext);
    const MenuRoot = isSubMenu ? BaseUIMenu.SubmenuRoot : BaseUIMenu.Root;
    const MenuTrigger = isSubMenu
      ? BaseUIMenu.SubmenuTrigger
      : BaseUIMenu.Trigger;

    const triggerEl = (
      typeof trigger === 'function' ? trigger({}, { open: true }) : trigger
    ) as ReactElement<HTMLButtonElement>;
    const isMenuDisabled = isSubMenu && Boolean(triggerEl.props.disabled);

    return (
      <SubMenuContext.Provider value={true}>
        <MenuRoot
          onOpenChange={onOpenChange}
          onOpenChangeComplete={(open: boolean) => {
            if (!open && typeof onClose === 'function') {
              onClose();
            }
          }}
          disabled={isMenuDisabled}
        >
          <SubMenuTriggerContext.Provider value={true}>
            <MenuTrigger ref={triggerRef} render={trigger} />
          </SubMenuTriggerContext.Provider>
          <BaseUIMenu.Portal>
            <BaseUIMenu.Positioner
              align={align}
              alignOffset={isSubMenu ? -4 : 0}
              sideOffset={isSubMenu ? 0 : 6}
              collisionPadding={12}
              collisionAvoidance={{
                side: 'shift',
                align: 'shift',
              }}
            >
              <BaseUIMenu.Popup
                className={clsx({
                  [styles.popup]: true,
                  [styles.small]: width === 'small',
                })}
              >
                <ScrollContainer direction="vertical" fadeSize="small">
                  <div className={styles.menuSizeLimit}>{children}</div>
                </ScrollContainer>
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
