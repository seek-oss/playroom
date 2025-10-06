import snippets from '__PLAYROOM_ALIAS__SNIPPETS__';
import {
  type LucideIcon,
  CodeXml,
  Sun,
  Moon,
  Monitor,
  PanelLeft,
  PanelBottom,
  Frame as FrameIcon,
  BetweenHorizontalStart,
  File,
  Check,
  CopyPlus,
  FolderOpen,
  LayoutPanelLeft,
  Link as LinkIcon,
  Smartphone,
  Tablet,
  Maximize,
  Square,
  SunMoon,
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
  MenuClearItem,
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
import { SharedTooltipContext, Tooltip } from '../Tooltip/Tooltip';
import ChevronIcon from '../icons/ChevronIcon';

import * as styles from './Header.css';

export const logoSize = 24;

type FrameWidthIconRange = {
  min: number;
  max?: number;
  icon: LucideIcon;
};

const frameWidthIconRanges: Record<string, FrameWidthIconRange> = {
  mobile: { min: 0, max: 767, icon: Smartphone },
  tablet: { min: 768, max: 1023, icon: Tablet },
  desktop: { min: 1024, icon: Monitor },
};

const getIconForWidth = (width: number | 'Fit to window'): LucideIcon => {
  if (width === 'Fit to window') {
    return Maximize;
  }

  const ranges = Object.values(frameWidthIconRanges);
  for (const range of ranges) {
    const withinMin = width >= range.min;
    const withinMax = typeof range.max === 'number' ? width <= range.max : true;

    if (withinMin && withinMax) {
      return range.icon;
    }
  }

  return FrameIcon;
};

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
      <MenuGroup
        label="Widths"
        action={
          hasFilteredWidths ? (
            <MenuClearItem
              onClick={() => dispatch({ type: 'resetSelectedWidths' })}
              aria-label="Clear selected widths"
            >
              Clear
            </MenuClearItem>
          ) : null
        }
      >
        {availableWidths.map((width) => (
          <MenuCheckboxItem
            icon={getIconForWidth(width)}
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
      </MenuGroup>

      {themesEnabled ? (
        <>
          <MenuSeparator />

          <MenuGroup
            label="Themes"
            action={
              hasFilteredThemes ? (
                <MenuClearItem
                  onClick={() => dispatch({ type: 'resetSelectedThemes' })}
                  aria-label="Clear selected themes"
                >
                  Clear
                </MenuClearItem>
              ) : null
            }
          >
            {availableThemes.map((theme) => (
              <MenuCheckboxItem
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
          </MenuGroup>
        </>
      ) : null}
    </>
  );
};

const ShareMenu = () => {
  const [{ code, title, editorHidden }] = useContext(StoreContext);

  return (
    <>
      <MenuCopyItem content={window.location.href}>
        Link to edit mode
      </MenuCopyItem>
      {themesEnabled ? (
        <>
          <MenuSeparator />
          <MenuGroup label="Link to preview mode">
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
                <MenuCopyItem key={theme} content={previewUrl}>
                  {theme}
                </MenuCopyItem>
              );
            })}
          </MenuGroup>
        </>
      ) : (
        <MenuCopyItem
          content={createPreviewUrl({
            baseUrl: window.location.href
              .split(playroomConfig.paramType === 'hash' ? '#' : '?')[0]
              .split('index.html')[0],
            code,
            paramType: playroomConfig.paramType,
            title,
            editorHidden,
          })}
        >
          Link to preview mode
        </MenuCopyItem>
      )}
    </>
  );
};

const HeaderMenu = () => {
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const inputCommandRef = useRef<EditorCommand | null>(null);
  const { runCommand } = useEditor();
  const [
    {
      editorOrientation,
      editorHidden,
      colorScheme,
      hasSyntaxError,
      openDialogOpen,
    },
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
        dispatch({ type: 'openPlayroomDialog' });
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch]);

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
          <Tooltip
            label="Main menu"
            trigger={
              <button
                type="button"
                aria-label="Main menu"
                className={styles.menuButton}
              >
                <Logo size={logoSize} />
                <ChevronIcon direction="down" size={12} />
              </button>
            }
          />
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
          onClick={() => dispatch({ type: 'openPlayroomDialog' })}
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
          trigger={
            <MenuItem
              icon={CodeXml}
              disabled={editorHidden}
              disabledReason="Editor is hidden"
            >
              Editor actions
            </MenuItem>
          }
          width="content"
          disabled={editorHidden}
        >
          {hasSnippets && (
            <MenuItem
              icon={BetweenHorizontalStart}
              shortcut={['Cmd', 'K']}
              disabled={hasSyntaxError}
              disabledReason="Code has syntax errors preventing snippets"
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
              disabledReason={
                command === 'formatCode'
                  ? 'Code has syntax errors preventing format'
                  : undefined
              }
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
              <MenuRadioItem icon={Square} value="hidden">
                Hidden
              </MenuRadioItem>
            </MenuRadioGroup>
          </MenuGroup>
        </Menu>

        <Menu
          trigger={<MenuItem icon={SunMoon}>Appearance</MenuItem>}
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
        open={openDialogOpen}
        onOpenChange={(open) =>
          dispatch({
            type: open ? 'openPlayroomDialog' : 'closePlayroomDialog',
          })
        }
      >
        <div className={styles.openDialogContent}>
          <PreviewTiles
            onSelect={() => dispatch({ type: 'closePlayroomDialog' })}
          />
        </div>
      </Dialog>
    </>
  );
};

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
      <SharedTooltipContext>
        <div className={styles.actionsContainer}>
          {/* Todo - try animate in/out */}
          {hasCode ? (
            <div className={styles.segmentedGroup}>
              <button
                type="button"
                className={styles.segmentedTextButton}
                disabled={copying}
                onClick={() => onCopyClick(window.location.href)}
              >
                <Box component="span" opacity={copying ? 0 : undefined}>
                  <Text>Copy link</Text>
                </Box>
                {copying ? (
                  <span className={styles.copyLinkSuccess}>
                    <Check size={14} />
                  </span>
                ) : null}
              </button>
              <Menu
                width="small"
                align="end"
                trigger={
                  <Tooltip
                    label="Share options"
                    trigger={
                      <button
                        type="button"
                        aria-label="Share options"
                        className={styles.segmentedIconButton}
                      >
                        <ChevronIcon direction="down" size={14} />
                      </button>
                    }
                  />
                }
              >
                <ShareMenu />
              </Menu>
            </div>
          ) : null}

          <Menu
            width="small"
            align="end"
            trigger={
              <ButtonIcon label="Configure frames" icon={<FrameIcon />} />
            }
          >
            <FramesMenu />
          </Menu>

          <ButtonIcon
            label={editorHidden ? 'Show code' : 'Hide code'}
            icon={<CodeXml />}
            variant={editorHidden ? 'standard' : 'solid'}
            onClick={() =>
              dispatch({ type: editorHidden ? 'showEditor' : 'hideEditor' })
            }
          />
        </div>
      </SharedTooltipContext>
    </Box>
  );
};
