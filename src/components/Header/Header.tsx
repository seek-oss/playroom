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
  Eye,
  Link as LinkIcon,
  MaximizeIcon,
  BetweenHorizontalStart,
  File,
} from 'lucide-react';
import { useContext, useRef, useState } from 'react';

import { themeNames as availableThemes } from '../../configModules/themes';
import availableWidths from '../../configModules/widths';
import { useEditor } from '../../contexts/EditorContext';
import { StoreContext } from '../../contexts/StoreContext';
import { Box } from '../Box/Box';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import {
  type EditorCommand,
  editorCommandList,
} from '../CodeEditor/editorCommands';
import { Dialog } from '../Dialog/Dialog';
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
import PreviewPanel from '../PreviewSelection/PreviewDialog';
import { Title } from '../Title/Title';
import ChevronIcon from '../icons/ChevronIcon';

import * as styles from './Header.css';
import * as buttonStyles from '../ButtonIcon/ButtonIcon.css';

const HeaderMenu = () => {
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const inputCommandRef = useRef<EditorCommand | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const { runCommand } = useEditor();
  const [{ code, editorOrientation, editorHidden, colorScheme }, dispatch] =
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

        <MenuItem
          icon={Eye}
          onClick={() => setPreviewDialogOpen(true)}
          disabled={code.trim().length === 0}
        >
          Preview
        </MenuItem>

        <MenuItem
          icon={LinkIcon}
          onClick={() => {
            dispatch({
              type: 'copyToClipboard',
              payload: {
                content: window.location.href,
                message: 'Copied Playroom link to clipboard',
              },
            });
          }}
        >
          Copy link
        </MenuItem>

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

      {/* Preview Dialog */}
      <Dialog
        title="Preview"
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
      >
        <PreviewPanel />
      </Dialog>
    </>
  );
};

const headerButtonIconSize = 'medium';

export const Header = () => {
  const [{ visibleWidths = [], visibleThemes = [], editorHidden }, dispatch] =
    useContext(StoreContext);

  const hasThemes =
    availableThemes.filter((theme) => theme !== '__PLAYROOM__NO_THEME__')
      .length > 0;
  const hasFilteredWidths =
    visibleWidths.length > 0 && visibleWidths.length <= availableWidths.length;
  const hasFilteredThemes =
    visibleThemes.length > 0 && visibleThemes.length <= availableThemes.length;

  return (
    <Box className={styles.root}>
      <div className={styles.menuContainer}>
        <HeaderMenu />
      </div>

      <Title />

      {/* Empty placeholder for now */}
      <div className={styles.actionsContainer}>
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
                checked={hasFilteredWidths && visibleWidths.includes(width)}
                onCheckedChange={(checked: boolean) => {
                  const newWidths =
                    visibleWidths.length === 0 ? [width] : visibleWidths;

                  dispatch({
                    type: 'updateVisibleWidths',
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
              onClick={() => dispatch({ type: 'resetVisibleWidths' })}
              closeOnClick={false}
              disabled={!hasFilteredWidths}
            >
              Clear selection
            </MenuItem>
          </MenuGroup>

          {hasThemes ? (
            <>
              <MenuSeparator />

              <MenuGroup label="Themes">
                {availableThemes.map((theme) => (
                  <MenuCheckboxItem
                    icon={Palette}
                    key={theme}
                    checked={hasFilteredThemes && visibleThemes.includes(theme)}
                    onCheckedChange={(checked: boolean) => {
                      const newThemes =
                        visibleThemes.length === 0 ? [theme] : visibleThemes;

                      dispatch({
                        type: 'updateVisibleThemes',
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
                  onClick={() => dispatch({ type: 'resetVisibleThemes' })}
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
