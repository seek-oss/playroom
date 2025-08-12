import { Tooltip } from '@base-ui-components/react';
import { useContext, useRef, useState } from 'react';

import { StoreContext } from '../../contexts/StoreContext';
import { Box } from '../Box/Box';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { Dialog } from '../Dialog/Dialog';
import FramesPanel from '../FramesPanel/FramesPanel';
import { KeyboardShortcuts } from '../Keybindings/Keybindings';
import { Logo } from '../Logo/Logo';
import {
  Menu,
  MenuItem,
  MenuSeparator,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
} from '../Menu/Menu';
import { Popover } from '../Popover/Popover';
import { CopyButton } from '../PreviewPanel/CopyButton';
import PreviewPanel from '../PreviewPanel/PreviewPanel';
import FramesIcon from '../icons/FramesIcon';
import PlayIcon from '../icons/PlayIcon';
import ShareIcon from '../icons/ShareIcon';

import * as styles from './Header.css';

export const HeaderMenu = () => {
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const [{ editorHidden, editorPosition, colorScheme }, dispatch] =
    useContext(StoreContext);
  const [framesMode, setFramesMode] = useState<'frames' | 'responsive'>(
    'frames'
  );
  const [assistant, setAssistant] = useState(true);
  const [shortcuts, setShortcuts] = useState(false);

  return (
    <>
      <Menu
        ref={menuTriggerRef}
        trigger={
          <span className={styles.menuButton}>
            <Logo size={18} />
          </span>
        }
      >
        <MenuItem onClick={() => {}}>New</MenuItem>
        <MenuItem onClick={() => {}}>Open</MenuItem>
        <MenuItem onClick={() => {}}>Share</MenuItem>

        <MenuSeparator />

        <Menu trigger="View">
          <MenuCheckboxItem
            checked={!editorHidden}
            onCheckedChange={(newValue) =>
              dispatch({
                type: newValue ? 'showEditor' : 'hideEditor',
              })
            }
          >
            Editor
          </MenuCheckboxItem>
          <MenuCheckboxItem checked={assistant} onCheckedChange={setAssistant}>
            Assistant
          </MenuCheckboxItem>

          <MenuSeparator />

          <MenuRadioGroup value={framesMode} onValueChange={setFramesMode}>
            <MenuRadioItem value="frames">Frames</MenuRadioItem>
            <MenuRadioItem value="responsive">Responsive</MenuRadioItem>
          </MenuRadioGroup>
        </Menu>

        <MenuSeparator />

        <Menu trigger="Preferences">
          <Menu trigger="Editor Position">
            <MenuRadioGroup
              value={editorPosition}
              onValueChange={(value) => {
                dispatch({
                  type: 'updateEditorPosition',
                  payload: { position: value },
                });
              }}
            >
              {['Bottom', 'Right', 'Left'].map((position) => (
                <MenuRadioItem value={position.toLowerCase()} key={position}>
                  {position}
                </MenuRadioItem>
              ))}
            </MenuRadioGroup>
          </Menu>

          <Menu trigger="Theme">
            <MenuRadioGroup
              value={colorScheme.toLowerCase()}
              onValueChange={(value) => {
                dispatch({
                  type: 'updateColorScheme',
                  payload: { colorScheme: value },
                });
              }}
            >
              {['Light', 'Dark', 'System'].map((theme) => (
                <MenuRadioItem value={theme.toLowerCase()} key={theme}>
                  {theme}
                </MenuRadioItem>
              ))}
            </MenuRadioGroup>
          </Menu>
        </Menu>

        <MenuItem onClick={() => setShortcuts(true)}>
          Keyboard Shortcuts
        </MenuItem>
      </Menu>

      <Dialog
        title="Keyboard Shortcuts"
        open={shortcuts}
        onOpenChange={setShortcuts}
      >
        <KeyboardShortcuts />
      </Dialog>
    </>
  );
};

export const Header = () => {
  const [{ title }, dispatch] = useContext(StoreContext);

  return (
    <Box className={styles.root}>
      <Box style={{ width: 100 }}>
        <HeaderMenu />
      </Box>
      <Box flexGrow={1} display="flex" justifyContent="center">
        <input
          type="text"
          placeholder="Untitled Playroom"
          className={styles.textField}
          value={title}
          onChange={(e) =>
            dispatch({
              type: 'updateTitle',
              payload: { title: e.target.value },
            })
          }
        />
      </Box>
      <Box
        display="flex"
        justifyContent="flex-end"
        gap="medium"
        style={{ width: 100 }}
      >
        <Tooltip.Provider>
          <Popover
            aria-label="Configure visible frames"
            align="end"
            trigger={
              <ButtonIcon
                icon={<FramesIcon />}
                label="Configure visible frames"
                size="small"
              />
            }
          >
            <FramesPanel />
          </Popover>
          <Popover
            aria-label="Play"
            align="end"
            trigger={
              <ButtonIcon icon={<PlayIcon />} label="Play" size="small" />
            }
          >
            <PreviewPanel />
          </Popover>
          <Popover
            aria-label="Share"
            align="end"
            trigger={
              <ButtonIcon icon={<ShareIcon />} label="Share" size="small" />
            }
          >
            <CopyButton title="Copy" />
          </Popover>
        </Tooltip.Provider>
      </Box>
    </Box>
  );
};
