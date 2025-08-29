import { Popover as BaseUIPopover } from '@base-ui-components/react/popover';
import snippets from '__PLAYROOM_ALIAS__SNIPPETS__';
import clsx from 'clsx';
import {
  CodeXml,
  Sun,
  Moon,
  Monitor,
  PanelLeft,
  PanelBottom,
  Frame as FrameIcon,
  Eraser,
  Palette,
  MaximizeIcon,
  BetweenHorizontalStart,
  File,
} from 'lucide-react';
import { useContext, useRef } from 'react';

import {
  themeNames as availableThemes,
  themesEnabled,
} from '../../configModules/themes';
import availableWidths from '../../configModules/widths';
import { useEditor } from '../../contexts/EditorContext';
import { StoreContext } from '../../contexts/StoreContext';
import { Box } from '../Box/Box';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import {
  type EditorCommand,
  editorCommandList,
} from '../CodeEditor/editorCommands';
import { Logo } from '../Logo/Logo';
import {
  Menu,
  MenuCheckboxItem,
  MenuGroup,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
} from '../Menu/Menu';
import { PreviewSelection } from '../PreviewSelection/PreviewSelection';
import { Text } from '../Text/Text';
import { Title } from '../Title/Title';
import ChevronIcon from '../icons/ChevronIcon';

import * as styles from './Header.css';
import * as buttonStyles from '../ButtonIcon/ButtonIcon.css';

const HeaderMenu = () => {
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const inputCommandRef = useRef<EditorCommand | null>(null);
  const { runCommand } = useEditor();
  const [{ editorOrientation, editorHidden, colorScheme }, dispatch] =
    useContext(StoreContext);

  const hasSnippets = snippets && snippets.length > 0;

  return (
    <>
      <Menu
        onClose={() => {
          if (inputCommandRef.current) {
            runCommand(inputCommandRef.current);
            inputCommandRef.current = null;
          }
        }}
        ref={menuTriggerRef}
        trigger={
          <span className={styles.menuButton}>
            <Logo size={24} />
            <ChevronIcon direction="down" size={12} />
          </span>
        }
      >
        <MenuItem
          icon={File}
          onClick={() => {
            const { origin, pathname } = window.location;
            window.open(`${origin}${pathname}`, '_blank');
          }}
        >
          New Playroom
        </MenuItem>

        <MenuSeparator />

        <Menu trigger="Appearance" icon={Monitor}>
          <MenuRadioGroup
            value={colorScheme}
            onValueChange={(value) =>
              dispatch({
                type: 'updateColorScheme',
                payload: { colorScheme: value },
              })
            }
          >
            <MenuRadioItem icon={Monitor} value="system">
              System
            </MenuRadioItem>
            <MenuRadioItem icon={Sun} value="light">
              Light
            </MenuRadioItem>
            <MenuRadioItem icon={Moon} value="dark">
              Dark
            </MenuRadioItem>
          </MenuRadioGroup>
        </Menu>

        <Menu trigger="Editor position" icon={CodeXml}>
          <MenuRadioGroup
            value={editorOrientation}
            onValueChange={(value) => {
              dispatch({
                type: 'updateEditorOrientation',
                payload: { orientation: value },
              });
            }}
          >
            <MenuRadioItem icon={PanelBottom} value="horizontal">
              Bottom
            </MenuRadioItem>
            <MenuRadioItem icon={PanelLeft} value="vertical">
              Left
            </MenuRadioItem>
          </MenuRadioGroup>
        </Menu>

        <Menu trigger="Editor actions" icon={CodeXml} disabled={editorHidden}>
          {hasSnippets && (
            <MenuItem
              icon={BetweenHorizontalStart}
              shortcut={['Cmd', 'K']}
              disabled={editorHidden}
              onClick={() => dispatch({ type: 'openSnippets' })}
            >
              Insert snippet
            </MenuItem>
          )}
          {editorCommandList.map(({ command, label, shortcut, icon: Icon }) => (
            <MenuItem
              key={command}
              shortcut={shortcut}
              onClick={() => {
                inputCommandRef.current = command;
              }}
              icon={Icon}
            >
              {label}
            </MenuItem>
          ))}
        </Menu>
      </Menu>
    </>
  );
};

const headerButtonIconSize = 'medium';

export const Header = () => {
  const [{ code, selectedWidths, selectedThemes, editorHidden }, dispatch] =
    useContext(StoreContext);

  const hasCode = code.trim().length > 0;
  const hasFilteredWidths =
    selectedWidths.length > 0 &&
    selectedWidths.length <= availableWidths.length;
  const hasFilteredThemes =
    selectedThemes.length > 0 &&
    selectedThemes.length <= availableThemes.length;

  return (
    <Box className={styles.root}>
      <div className={styles.menuContainer}>
        <HeaderMenu />
      </div>

      <Title />

      <div className={styles.actionsContainer}>
        {/* Todo - try animate in/out */}
        {hasCode ? (
          <div className={styles.segmentedGroup}>
            <button
              type="button"
              className={styles.segmentedTextButton}
              onClick={() =>
                dispatch({
                  type: 'copyToClipboard',
                  payload: {
                    content: window.location.href,
                    message: 'Copied Playroom link to clipboard',
                  },
                })
              }
            >
              <Text>Share</Text>
            </button>
            <BaseUIPopover.Root>
              <BaseUIPopover.Trigger
                render={(triggerProps) => (
                  <button
                    type="button"
                    className={styles.segmentedIconButton}
                    {...triggerProps}
                  >
                    <ChevronIcon direction="down" size={10} />
                  </button>
                )}
              />
              <BaseUIPopover.Portal>
                <BaseUIPopover.Positioner side="bottom" sideOffset={10}>
                  <BaseUIPopover.Popup className={styles.sharePopup}>
                    <PreviewSelection />
                  </BaseUIPopover.Popup>
                </BaseUIPopover.Positioner>
              </BaseUIPopover.Portal>
            </BaseUIPopover.Root>
          </div>
        ) : null}

        <Menu
          trigger={
            <span
              aria-label="Configure frames"
              className={clsx(
                buttonStyles.button,
                buttonStyles.size[headerButtonIconSize]
              )}
            >
              <FrameIcon />
            </span>
          }
        >
          <MenuGroup label="Widths">
            {availableWidths.map((width) => (
              <MenuCheckboxItem
                icon={width === 'Fit to window' ? MaximizeIcon : FrameIcon}
                key={width}
                checked={hasFilteredWidths && selectedWidths.includes(width)}
                onCheckedChange={(checked: boolean) => {
                  const newWidths =
                    selectedWidths.length === 0 ? [width] : selectedWidths;

                  dispatch({
                    type: 'updateSelectedWidths',
                    payload: {
                      widths: checked
                        ? [...newWidths, width]
                        : newWidths.filter((w) => w !== width),
                    },
                  });
                }}
              >
                {width}
              </MenuCheckboxItem>
            ))}
            <MenuItem
              icon={Eraser}
              onClick={() => dispatch({ type: 'resetSelectedWidths' })}
              closeOnClick={false}
              disabled={!hasFilteredWidths}
            >
              Clear selection
            </MenuItem>
          </MenuGroup>

          {themesEnabled ? (
            <>
              <MenuSeparator />

              <MenuGroup label="Themes">
                {availableThemes.map((theme) => (
                  <MenuCheckboxItem
                    icon={Palette}
                    key={theme}
                    checked={
                      hasFilteredThemes && selectedThemes.includes(theme)
                    }
                    onCheckedChange={(checked: boolean) => {
                      const newThemes =
                        selectedThemes.length === 0 ? [theme] : selectedThemes;

                      dispatch({
                        type: 'updateSelectedThemes',
                        payload: {
                          themes: checked
                            ? [...newThemes, theme]
                            : newThemes.filter((w) => w !== theme),
                        },
                      });
                    }}
                  >
                    {theme}
                  </MenuCheckboxItem>
                ))}
                <MenuItem
                  icon={Eraser}
                  onClick={() => dispatch({ type: 'resetSelectedThemes' })}
                  closeOnClick={false}
                  disabled={!hasFilteredThemes}
                >
                  Clear selection
                </MenuItem>
              </MenuGroup>
            </>
          ) : null}
        </Menu>

        <ButtonIcon
          size={headerButtonIconSize}
          label={editorHidden ? 'Show code' : 'Hide code'}
          icon={<CodeXml />}
          onClick={() =>
            dispatch({ type: editorHidden ? 'showEditor' : 'hideEditor' })
          }
        />
      </div>
    </Box>
  );
};
