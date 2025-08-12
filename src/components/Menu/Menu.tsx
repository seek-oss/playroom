import { Menu as BaseUIMenu } from '@base-ui-components/react/menu';
import {
  type ComponentProps,
  createContext,
  forwardRef,
  type ReactNode,
  useContext,
} from 'react';

import ChevronIcon from '../icons/ChevronIcon';
import TickIcon from '../icons/TickIcon';

import * as styles from './Menu.css';

export const MenuItem = ({
  onClick,
  children,
}: {
  onClick: ComponentProps<typeof BaseUIMenu.Item>['onClick'];
  children: ComponentProps<typeof BaseUIMenu.Item>['children'];
}) => (
  <BaseUIMenu.Item className={styles.item} onClick={onClick}>
    {children}
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
    <span className={styles.fieldItemLabel}>{children}</span>
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
    <BaseUIMenu.CheckboxItemIndicator className={styles.fieldItemIndicator}>
      <TickIcon />
    </BaseUIMenu.CheckboxItemIndicator>
    <span className={styles.fieldItemLabel}>{children}</span>
  </BaseUIMenu.CheckboxItem>
);

export const MenuSeparator = () => (
  <BaseUIMenu.Separator className={styles.separator} />
);

const MenuContext = createContext(false);

type Props = {
  trigger: ReactNode;
  align?: ComponentProps<typeof BaseUIMenu.Positioner>['align'];
  children: ComponentProps<typeof BaseUIMenu.Popup>['children'];
};
export const Menu = forwardRef<HTMLButtonElement, Props>(
  ({ trigger, align = 'start', children }, triggerRef) => {
    const isSubMenu = useContext(MenuContext);
    const MenuRoot = isSubMenu ? BaseUIMenu.SubmenuRoot : BaseUIMenu.Root;
    const MenuTrigger = isSubMenu
      ? BaseUIMenu.SubmenuTrigger
      : BaseUIMenu.Trigger;

    return (
      <MenuContext.Provider value={true}>
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
              className={styles.positioner}
              align={align}
              alignOffset={-8 /* Align with the padding size of the popup */}
              sideOffset={
                isSubMenu
                  ? 10 /* Align with the padding size of the popup + gap */
                  : 16 /* Double padding size */
              }
            >
              <BaseUIMenu.Popup className={styles.popup}>
                {children}
              </BaseUIMenu.Popup>
            </BaseUIMenu.Positioner>
          </BaseUIMenu.Portal>
        </MenuRoot>
      </MenuContext.Provider>
    );
  }
);
