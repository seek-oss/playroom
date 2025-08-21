import { Menu as BaseUIMenu } from '@base-ui-components/react/menu';
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
const isMacPlatform = isMac();

const nonMacKeyMap: Record<string, string> = {
  '⌘': 'Ctrl',
  '⌥': 'Alt',
  '⇧': 'Shift',
};

const convertShortcutForPlatform = (shortcut: Shortcut) => {
  if (isMacPlatform) {
    return shortcut;
  }

  return shortcut.map((key) => nonMacKeyMap[key] || key);
};

export const MenuItem = ({
  onClick,
  shortcut,
  children,
  closeOnClick,
  disabled,
}: {
  onClick: ComponentProps<typeof BaseUIMenu.Item>['onClick'];
  shortcut?: Shortcut;
  children: ComponentProps<typeof BaseUIMenu.Item>['children'];
  closeOnClick?: ComponentProps<typeof BaseUIMenu.Item>['closeOnClick'];
  disabled?: ComponentProps<typeof BaseUIMenu.Item>['disabled'];
}) => (
  <BaseUIMenu.Item
    className={styles.item}
    onClick={onClick}
    closeOnClick={closeOnClick}
    disabled={disabled}
  >
    {children}
    {shortcut && (
      <Text tone="secondary">
        {convertShortcutForPlatform(shortcut).join('')}
      </Text>
    )}
  </BaseUIMenu.Item>
);

export const MenuRadioGroup = BaseUIMenu.RadioGroup;

export const MenuRadioItem = ({
  value,
  children,
}: {
  value: ComponentProps<typeof BaseUIMenu.RadioItem>['value'];
  children: ComponentProps<typeof BaseUIMenu.RadioItem>['children'];
}) => (
  <BaseUIMenu.RadioItem className={styles.fieldItem} value={value}>
    {children}
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
}: {
  checked: ComponentProps<typeof BaseUIMenu.CheckboxItem>['checked'];
  onCheckedChange: ComponentProps<
    typeof BaseUIMenu.CheckboxItem
  >['onCheckedChange'];
  children: ComponentProps<typeof BaseUIMenu.CheckboxItem>['children'];
}) => (
  <BaseUIMenu.CheckboxItem
    checked={checked}
    onCheckedChange={onCheckedChange}
    className={styles.fieldItem}
  >
    {children}
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
};
export const Menu = forwardRef<HTMLButtonElement, Props>(
  ({ trigger, align = 'start', children }, triggerRef) => {
    const isSubMenu = useContext(SubMenuContext);
    const MenuRoot = isSubMenu ? BaseUIMenu.SubmenuRoot : BaseUIMenu.Root;
    const MenuTrigger = isSubMenu
      ? BaseUIMenu.SubmenuTrigger
      : BaseUIMenu.Trigger;

    return (
      <SubMenuContext.Provider value={true}>
        <MenuRoot>
          <MenuTrigger
            ref={triggerRef}
            className={isSubMenu ? styles.submenuTrigger : styles.trigger}
          >
            {trigger}
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
