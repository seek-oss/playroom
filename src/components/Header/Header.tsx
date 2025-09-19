import { Tooltip } from '@base-ui-components/react';
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
  Check,
  CopyPlus,
  FolderOpen,
  LayoutPanelLeft,
  EyeOff,
  Link as LinkIcon,
} from 'lucide-react';
import { useContext, useEffect, useRef, useState } from 'react';

import { compressParams, createPreviewUrl } from '../../../utils';
import playroomConfig from '../../config';
import {
  themeNames as availableThemes,
  themesEnabled,
} from '../../configModules/themes';
import availableWidths from '../../configModules/widths';
import { useEditor } from '../../contexts/EditorContext';
import { StoreContext } from '../../contexts/StoreContext';
import { isMac } from '../../utils/formatting';
import { createUrlForData, resolveDataFromUrl } from '../../utils/params';
import { useCopy } from '../../utils/useCopy';
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
  MenuCopyItem,
  MenuGroup,
  MenuItem,
  MenuItemLink,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
} from '../Menu/Menu';
import { PreviewTiles } from '../PreviewTiles/PreviewTiles';
import { Text } from '../Text/Text';
import { Title } from '../Title/Title';
import ChevronIcon from '../icons/ChevronIcon';

import * as styles from './Header.css';

const FramesMenu = () => {
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
        </>
      ) : null}
    </>
  );
};

const ShareMenu = () => {
  const [{ code, title, editorHidden }] = useContext(StoreContext);
  const { onCopyClick } = useCopy();

  return (
    <>
      <MenuCopyItem onCopy={() => onCopyClick(window.location.href)}>
        Playroom link
      </MenuCopyItem>
      {themesEnabled ? (
        <>
          <MenuSeparator />
          <MenuGroup label="Preview link">
            {availableThemes.map((theme) => {
              const baseUrl = window.location.href
                .split(playroomConfig.paramType === 'hash' ? '#' : '?')[0]
                .split('index.html')[0];
              const previewUrl = createPreviewUrl({
                baseUrl,
                code,
                theme,
                paramType: playroomConfig.paramType,
                title,
                editorHidden,
              });

              return (
                <MenuCopyItem
                  key={theme}
                  onCopy={() => onCopyClick(previewUrl)}
                >
                  {theme}
                </MenuCopyItem>
              );
            })}
          </MenuGroup>
        </>
      ) : (
        <MenuCopyItem
          onCopy={() => {
            const baseUrl = window.location.href
              .split(playroomConfig.paramType === 'hash' ? '#' : '?')[0]
              .split('index.html')[0];
            const previewUrl = createPreviewUrl({
              baseUrl,
              code,
              paramType: playroomConfig.paramType,
              title,
              editorHidden,
            });
            onCopyClick(previewUrl);
          }}
        >
          Preview link
        </MenuCopyItem>
      )}
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
  const [editorPosition, setEditorPosition] = useState<
    'vertical' | 'horizontal' | 'hidden'
  >(editorHidden ? 'hidden' : editorOrientation);

  const hasSnippets = snippets && snippets.length > 0;
  const { title, ...params } = resolveDataFromUrl();
  const duplicateUrl = createUrlForData(
    compressParams({
      ...params,
      title: title ? `(Copy) ${title}` : undefined,
    })
  );

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
        width="small"
        trigger={
          <span className={styles.menuButton}>
            <Logo size={24} />
            <ChevronIcon direction="down" size={12} />
          </span>
        }
      >
        <MenuItemLink
          icon={File}
          href={window.location.pathname}
          target="_blank"
        >
          New Playroom
        </MenuItemLink>
        <MenuItem
          icon={FolderOpen}
          onClick={() => setOpenDialog(true)}
          shortcut={['Cmd', 'O']}
        >
          Open...
        </MenuItem>
        <MenuItemLink icon={CopyPlus} href={duplicateUrl} target="_blank">
          Duplicate
        </MenuItemLink>

        <Menu
          trigger={<MenuItem icon={LinkIcon}>Share</MenuItem>}
          width="small"
        >
          <ShareMenu />
        </Menu>

        <MenuSeparator />

        <Menu
          trigger={<MenuItem icon={FrameIcon}>Frames</MenuItem>}
          width="small"
        >
          <FramesMenu />
        </Menu>

        <Menu
          trigger={<MenuItem icon={CodeXml}>Editor actions</MenuItem>}
          width="small"
          disabled={editorHidden}
        >
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

        <Menu
          trigger={<MenuItem icon={LayoutPanelLeft}>View</MenuItem>}
          width="small"
        >
          <MenuGroup label="Editor Position">
            <MenuRadioGroup
              value={editorPosition}
              onValueChange={(newValue: typeof editorPosition) => {
                setEditorPosition(newValue);

                if (newValue === 'hidden') {
                  dispatch({ type: 'hideEditor' });
                } else {
                  dispatch({
                    type: 'updateEditorOrientation',
                    payload: { orientation: newValue },
                  });
                }
              }}
            >
              <MenuRadioItem icon={PanelLeft} value="vertical">
                Left
              </MenuRadioItem>
              <MenuRadioItem icon={PanelBottom} value="horizontal">
                Bottom
              </MenuRadioItem>
              <MenuRadioItem icon={EyeOff} value="hidden">
                Hidden
              </MenuRadioItem>
            </MenuRadioGroup>
          </MenuGroup>
        </Menu>

        <Menu
          trigger={<MenuItem icon={Monitor}>Appearance</MenuItem>}
          width="small"
        >
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

const headerButtonIconSize = 'small';

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
  const { copying, onCopyClick } = useCopy();

  const hasCode = code.trim().length > 0;

  return (
    <Box className={styles.root}>
      <div className={styles.menuContainer}>
        <HeaderMenu />
      </div>

      <Title />

      <Tooltip.Provider>
        <div className={styles.actionsContainer}>
          {/* Todo - try animate in/out */}
          {hasCode ? (
            <div className={styles.segmentedGroup}>
              <CopyLinkButton
                linkCopied={copying}
                onClick={() => onCopyClick(window.location.href)}
              />
              <Menu
                width="small"
                align="end"
                trigger={
                  <button type="button" className={styles.segmentedIconButton}>
                    <ChevronIcon direction="down" size={14} />
                  </button>
                }
              >
                <ShareMenu />
              </Menu>
            </div>
          ) : null}

          <Menu
            width="small"
            trigger={
              <ButtonIcon
                size={headerButtonIconSize}
                label="Configure frames"
                icon={<FrameIcon />}
              />
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
      </Tooltip.Provider>
    </Box>
  );
};
