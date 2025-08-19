import { useContext, useRef, useState } from 'react';

import { themeNames as availableThemes } from '../../configModules/themes';
import availableWidths from '../../configModules/widths';
import { StoreContext } from '../../contexts/StoreContext';
import { Box } from '../Box/Box';
import { Dialog } from '../Dialog/Dialog';
import { Logo } from '../Logo/Logo';
import {
  Menu,
  MenuCheckboxItem,
  MenuGroup,
  MenuItem,
  MenuSeparator,
} from '../Menu/Menu';
import PreviewPanel from '../PreviewDialog/PreviewDialog';

import * as styles from './Header.css';

const HeaderMenu = () => {
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const [{ visibleWidths = [], visibleThemes = [], code }, dispatch] =
    useContext(StoreContext);

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
        <Menu trigger="Configure Frames">
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
          onClick={() => setIsPreviewDialogOpen(true)}
          disabled={code.trim().length === 0}
        >
          Preview
        </MenuItem>
      </Menu>

      {/* Preview Dialog */}
      <Dialog
        title="Preview"
        open={isPreviewDialogOpen}
        onOpenChange={setIsPreviewDialogOpen}
      >
        <PreviewPanel />
      </Dialog>
    </>
  );
};

export const Header = () => (
  <Box className={styles.root}>
    <HeaderMenu />
  </Box>
);
