import snippets from '__PLAYROOM_ALIAS__SNIPPETS__';
import clsx from 'clsx';
import copy from 'copy-to-clipboard';
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
  Check,
  CopyPlus,
  FolderOpen,
  LayoutPanelLeft,
  PanelBottomClose,
  PanelLeftClose,
  PanelBottomOpen,
  PanelLeftOpen,
  type LucideIcon,
} from 'lucide-react';
import { useContext, useEffect, useRef, useState } from 'react';

import { compressParams } from '../../../utils';
import {
  themeNames as availableThemes,
  themesEnabled,
} from '../../configModules/themes';
import availableWidths from '../../configModules/widths';
import { useEditor } from '../../contexts/EditorContext';
import {
  type EditorOrientation,
  StoreContext,
} from '../../contexts/StoreContext';
import { isMac } from '../../utils/formatting';
import { createUrlForData, resolveDataFromUrl } from '../../utils/params';
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
import { Popover } from '../Popover/Popover';
import { PreviewSelection } from '../PreviewSelection/PreviewSelection';
import { PreviewTiles } from '../PreviewTiles/PreviewTiles';
import { Text } from '../Text/Text';
import { Title } from '../Title/Title';
import ChevronIcon from '../icons/ChevronIcon';

import * as styles from './Header.css';
import * as buttonStyles from '../ButtonIcon/ButtonIcon.css';

const toggleEditorIcon: Record<
  EditorOrientation,
  Record<'show' | 'hide', LucideIcon>
> = {
  vertical: {
    hide: PanelLeftClose,
    show: PanelLeftOpen,
  },
  horizontal: {
    hide: PanelBottomClose,
    show: PanelBottomOpen,
  },
} as const;

const FramesMenu = ({
  trailingSeparator = false,
}: {
  trailingSeparator?: boolean;
}) => {
  const [{ selectedWidths, selectedThemes }, dispatch] =
    useContext(StoreContext);

  const hasFilteredWidths =
    selectedWidths.length > 0 &&
    selectedWidths.length <= availableWidths.length;
  const hasFilteredThemes =
    selectedThemes.length > 0 &&
    selectedThemes.length <= availableThemes.length;

  return (
    <>
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
                checked={hasFilteredThemes && selectedThemes.includes(theme)}
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

          {trailingSeparator && <MenuSeparator />}
        </>
      ) : null}
    </>
  );
};

const HeaderMenu = () => {
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const inputCommandRef = useRef<EditorCommand | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { runCommand } = useEditor();
  const [
    { editorOrientation, editorHidden, colorScheme, hasSyntaxError },
    dispatch,
  ] = useContext(StoreContext);

  const hasSnippets = snippets && snippets.length > 0;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const cmdOrCtrl = isMac() ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && e.key === 'o') {
        e.preventDefault();
        setOpenDialog(true);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
            window.open(`${window.location.pathname}`, '_blank');
          }}
        >
          New Playroom
        </MenuItem>
        <MenuItem
          icon={FolderOpen}
          onClick={() => setOpenDialog(true)}
          shortcut={['Cmd', 'O']}
        >
          Open...
        </MenuItem>
        <MenuItem
          icon={CopyPlus}
          onClick={() => {
            const { title, ...params } = resolveDataFromUrl();
            const url = createUrlForData(
              compressParams({
                ...params,
                title: `(Copy) ${title}`,
              })
            );
            window.open(url, '_blank');
          }}
        >
          Duplicate
        </MenuItem>

        <MenuSeparator />

        <Menu trigger="Frames" icon={FrameIcon}>
          <FramesMenu />
        </Menu>

        <Menu trigger="Editor actions" icon={CodeXml} disabled={editorHidden}>
          {hasSnippets && (
            <MenuItem
              icon={BetweenHorizontalStart}
              shortcut={['Cmd', 'K']}
              disabled={editorHidden || hasSyntaxError}
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
              disabled={command === 'formatCode' && hasSyntaxError}
            >
              {label}
            </MenuItem>
          ))}
        </Menu>

        <MenuSeparator />

        <Menu trigger="View" icon={LayoutPanelLeft}>
          <MenuGroup label="Editor Position">
            <MenuItem
              icon={PanelLeft}
              onClick={() =>
                dispatch({
                  type: 'updateEditorOrientation',
                  payload: { orientation: 'vertical' },
                })
              }
              closeOnClick={false}
            >
              Left
            </MenuItem>
            <MenuItem
              icon={PanelBottom}
              onClick={() =>
                dispatch({
                  type: 'updateEditorOrientation',
                  payload: { orientation: 'horizontal' },
                })
              }
              closeOnClick={false}
            >
              Bottom
            </MenuItem>
            <MenuItem
              icon={
                toggleEditorIcon[editorOrientation][
                  editorHidden ? 'show' : 'hide'
                ]
              }
              onClick={() =>
                dispatch({ type: editorHidden ? 'showEditor' : 'hideEditor' })
              }
              closeOnClick={false}
            >
              {editorHidden ? 'Show' : 'Hide'}
            </MenuItem>
          </MenuGroup>
        </Menu>

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
      </Menu>

      <Dialog
        title="Open Playroom"
        open={openDialog}
        onOpenChange={setOpenDialog}
      >
        <div className={styles.openDialogContent}>
          <PreviewTiles onSelect={() => setOpenDialog(false)} />
        </div>
      </Dialog>
    </>
  );
};

const headerButtonIconSize = 'medium';

const CopyLinkButton = ({
  linkCopied,
  onClick,
}: {
  linkCopied: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    className={styles.segmentedTextButton}
    disabled={linkCopied}
    onClick={onClick}
  >
    <span className={styles.copyLinkContainer}>
      {linkCopied ? (
        <span className={styles.copyLinkSuccess}>
          <Check size={14} />
        </span>
      ) : null}
      <span
        className={clsx(linkCopied ? styles.copyLinkTextHidden : undefined)}
        aria-hidden={linkCopied ? true : undefined}
      >
        <Text>Copy link</Text>
      </span>
    </span>
  </button>
);

export const Header = () => {
  const [{ code, editorHidden }, dispatch] = useContext(StoreContext);

  const hasCode = code.trim().length > 0;
  const [linkCopied, setLinkCopied] = useState(false);

  const handleShareClick = () => {
    copy(window.location.href);
    setLinkCopied(true);
  };

  useEffect(() => {
    if (!linkCopied) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setLinkCopied(false);
    }, 2000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [linkCopied]);

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
            <CopyLinkButton
              linkCopied={linkCopied}
              onClick={handleShareClick}
            />
            <Popover
              aria-label="Share options"
              align="end"
              side="bottom"
              trigger={(triggerProps) => (
                <button
                  type="button"
                  className={styles.segmentedIconButton}
                  {...triggerProps}
                >
                  <ChevronIcon direction="down" size={10} />
                </button>
              )}
            >
              <PreviewSelection />
            </Popover>
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
          <FramesMenu />
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
