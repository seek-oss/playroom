import { useContext, useRef, useState } from 'react';

import { themeNames as availableThemes } from '../../configModules/themes';
import availableWidths from '../../configModules/widths';
import { type EditorPosition, StoreContext } from '../../contexts/StoreContext';
import { Box } from '../Box/Box';
import { Dialog } from '../Dialog/Dialog';
import { KeyboardShortcuts } from '../KeyboardShortcuts/KeyboardShortcuts';
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

import * as styles from './Header.css';

const HeaderMenu = () => {
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [keyboardShortcutsDialogOpen, setKeyboardShortcutsDialogOpen] =
    useState(false);
  const [
    { visibleWidths = [], visibleThemes = [], code, editorPosition },
    dispatch,
  ] = useContext(StoreContext);

  const hasThemes =
    availableThemes.filter(
      (themeName) => themeName !== '__PLAYROOM__NO_THEME__'
    ).length > 0;
  const hasFilteredWidths =
    visibleWidths.length > 0 && visibleWidths.length <= availableWidths.length;
  const hasFilteredThemes =
    visibleThemes.length > 0 && visibleThemes.length <= availableThemes.length;

  return (
    <>
      <Menu
        ref={menuTriggerRef}
        trigger={
          <span className={styles.menuButton}>
            <Logo size={24} />
          </span>
        }
      >
        <Menu trigger="Configure frames">
          <MenuGroup label="Widths">
            {availableWidths.map((width) => (
              <MenuCheckboxItem
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

        <Menu trigger="Editor position">
          <MenuRadioGroup
            value={editorPosition}
            onValueChange={(value) =>
              dispatch({
                type: 'updateEditorPosition',
                payload: { position: value as EditorPosition },
              })
            }
          >
            <MenuRadioItem value="bottom">Bottom</MenuRadioItem>
            <MenuRadioItem value="right">Right</MenuRadioItem>
          </MenuRadioGroup>
        </Menu>

        <MenuItem
          onClick={() => setPreviewDialogOpen(true)}
          disabled={code.trim().length === 0}
        >
          Preview
        </MenuItem>

        <MenuItem onClick={() => setKeyboardShortcutsDialogOpen(true)}>
          Keyboard shortcuts
        </MenuItem>
      </Menu>

      {/* Preview Dialog */}
      <Dialog
        title="Preview"
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
      >
        <PreviewPanel />
      </Dialog>

      {/* Keyboard shortcuts dialog */}
      <Dialog
        title="Keyboard shortcuts"
        open={keyboardShortcutsDialogOpen}
        onOpenChange={setKeyboardShortcutsDialogOpen}
      >
        <KeyboardShortcuts />
      </Dialog>
    </>
  );
};

export const Header = () => (
  <Box className={styles.root}>
    <HeaderMenu />
  </Box>
);
