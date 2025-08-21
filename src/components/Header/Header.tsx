import { useContext, useRef, useState } from 'react';

import snippets from '../../configModules/snippets';
import { themeNames as availableThemes } from '../../configModules/themes';
import availableWidths from '../../configModules/widths';
import { usePreferences } from '../../contexts/PreferencesContext';
import { StoreContext } from '../../contexts/StoreContext';
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
import Snippets from '../Snippets/Snippets';
import { Title } from '../Title/Title';

import * as styles from './Header.css';

const HeaderMenu = () => {
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const snippetsSearchRef = useRef<HTMLInputElement>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [keyboardShortcutsDialogOpen, setKeyboardShortcutsDialogOpen] =
    useState(false);
  const { editorOrientation, setEditorOrientation, appearance, setAppearance } =
    usePreferences();
  const [
    {
      visibleWidths = [],
      visibleThemes = [],
      code,
      editorHidden,
      validCursorPosition,
      snippetsOpen,
    },
    dispatch,
  ] = useContext(StoreContext);

  const hasSnippets = snippets && snippets.length > 0;
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
        {hasSnippets && (
          <MenuItem
            onClick={() => dispatch({ type: 'openSnippets' })}
            disabled={!validCursorPosition}
            shortcut={['⌘', 'K']}
          >
            Insert snippet...
          </MenuItem>
        )}

        <Menu trigger="Appearance">
          <MenuRadioGroup value={appearance} onValueChange={setAppearance}>
            <MenuRadioItem value="system">System</MenuRadioItem>
            <MenuRadioItem value="light">Light</MenuRadioItem>
            <MenuRadioItem value="dark">Dark</MenuRadioItem>
          </MenuRadioGroup>
        </Menu>

        <Menu trigger="Editor position">
          <MenuRadioGroup
            value={editorOrientation}
            onValueChange={setEditorOrientation}
          >
            <MenuRadioItem value="horizontal">Bottom</MenuRadioItem>
            <MenuRadioItem value="vertical">Left</MenuRadioItem>
          </MenuRadioGroup>
        </Menu>

        <MenuCheckboxItem
          checked={editorHidden}
          onCheckedChange={() =>
            dispatch({ type: editorHidden ? 'showEditor' : 'hideEditor' })
          }
        >
          Hide editor
        </MenuCheckboxItem>

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

        <MenuItem
          onClick={() => setPreviewDialogOpen(true)}
          disabled={code.trim().length === 0}
        >
          Preview
        </MenuItem>

        <MenuItem
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

        <MenuItem onClick={() => setKeyboardShortcutsDialogOpen(true)}>
          Keyboard shortcuts
        </MenuItem>
      </Menu>

      {/* Snippets Dialog */}
      {hasSnippets && (
        <Dialog
          title="Insert snippet"
          open={snippetsOpen}
          onOpenChange={() => dispatch({ type: 'closeSnippets' })}
          initialFocus={snippetsSearchRef}
          finalFocus={menuTriggerRef}
        >
          <Snippets
            searchRef={snippetsSearchRef}
            onSelect={(snippet) => {
              if (snippet) {
                dispatch({
                  type: 'persistSnippet',
                  payload: { snippet },
                });
              } else {
                dispatch({ type: 'closeSnippets' });
              }
            }}
          />
        </Dialog>
      )}

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
    <div className={styles.menuContainer}>
      <HeaderMenu />
    </div>

    <Title />

    {/* Empty placeholder for now */}
    <div className={styles.actionsContainer} />
  </Box>
);
