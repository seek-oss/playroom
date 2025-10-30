import clsx from 'clsx';
import {
  type LucideIcon,
  Sun,
  Moon,
  Monitor,
  PanelLeft,
  PanelBottom,
  Frame as FrameIcon,
  File,
  CopyPlus,
  FolderOpen,
  LayoutPanelLeft,
  Link as LinkIcon,
  Smartphone,
  Tablet,
  Maximize,
  Square,
  SunMoon,
  Play,
  Check,
  Link,
  Eye,
  EyeClosed,
  ChevronDown,
} from 'lucide-react';
import {
  type ComponentProps,
  type ReactNode,
  useContext,
  useRef,
  useState,
} from 'react';

import { compressParams } from '../../../utils';
import {
  themeNames as availableThemes,
  themeNames,
  themesEnabled,
} from '../../configModules/themes';
import availableWidths from '../../configModules/widths';
import { StoreContext } from '../../contexts/StoreContext';
import { createUrlForData, resolveDataFromUrl } from '../../utils/params';
import { useCopy } from '../../utils/useCopy';
import usePreviewUrl from '../../utils/usePreviewUrl';
import { Box } from '../Box/Box';
import { Button } from '../Button/Button';
import { ButtonIcon, ButtonIconLink } from '../ButtonIcon/ButtonIcon';
import { primaryMod } from '../CodeEditor/editorCommands';
import { Dialog } from '../Dialog/Dialog';
import { Heading } from '../Heading/Heading';
import { Inline } from '../Inline/Inline';
import { Logo } from '../Logo/Logo';
import {
  Menu,
  MenuCheckboxItem,
  MenuClearItem,
  MenuGroup,
  MenuItem,
  MenuItemLink,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
} from '../Menu/Menu';
import { PreviewTiles } from '../PreviewTiles/PreviewTiles';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';
import { ThemeSelector } from '../ThemeSelector/ThemeSelector';
import { Title } from '../Title/Title';
import { SharedTooltipContext, Tooltip } from '../Tooltip/Tooltip';
import { useGlobalKeyboardShortcutsForWindow } from '../globalKeyboardShortcuts';

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

const HeaderMenu = ({ onShareClick }: { onShareClick: () => void }) => {
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const openDialogContentRef = useRef<HTMLDivElement>(null);
  const [
    {
      editorOrientation,
      editorHidden,
      panelsVisible,
      colorScheme,
      openDialogOpen,
      code,
      id,
    },
    dispatch,
  ] = useContext(StoreContext);

  const hasCode = code.trim().length > 0;
  const { title, ...params } = resolveDataFromUrl();
  const duplicateUrl = createUrlForData(
    compressParams({
      ...params,
      title: title ? `(Copy) ${title}` : undefined,
    })
  );

  useGlobalKeyboardShortcutsForWindow(window);

  return (
    <>
      <Menu
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
                <ChevronDown size={12} />
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
          shortcut={[primaryMod, 'O']}
        >
          Open Playroom...
        </MenuItem>
        <MenuItemLink
          icon={CopyPlus}
          href={duplicateUrl}
          target="_blank"
          disabled={!id}
          disabledReason="No active Playroom to duplicate"
        >
          Duplicate
        </MenuItemLink>

        <MenuItem
          icon={LinkIcon}
          disabled={!hasCode}
          disabledReason="No active Playroom to share"
          onClick={onShareClick}
        >
          Share
        </MenuItem>

        <MenuSeparator />

        <Menu
          trigger={<MenuItem icon={FrameIcon}>Frames</MenuItem>}
          width="small"
        >
          <FramesMenu />
        </Menu>

        <Menu
          trigger={<MenuItem icon={LayoutPanelLeft}>Editor Position</MenuItem>}
          width="small"
        >
          <MenuRadioGroup
            value={editorHidden ? 'hidden' : editorOrientation}
            onValueChange={(newValue) => {
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
        </Menu>

        <MenuItem
          icon={panelsVisible ? Eye : EyeClosed}
          onClick={() => dispatch({ type: 'togglePanelVisibility' })}
          shortcut={[primaryMod, '\\']}
        >
          Show/Hide UI
        </MenuItem>

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
        <div ref={openDialogContentRef} className={styles.openDialogContent}>
          <PreviewTiles
            onSelect={() => dispatch({ type: 'closePlayroomDialog' })}
            scrollingRef={openDialogContentRef}
          />
        </div>
      </Dialog>
    </>
  );
};

const MenuItemThemedPreviewLink = ({ theme }: { theme: string }) => {
  const previewUrl = usePreviewUrl(theme);

  return (
    <MenuItemLink href={previewUrl} target="_blank">
      {theme}
    </MenuItemLink>
  );
};

export const Header = () => {
  const [{ code, selectedThemes }] = useContext(StoreContext);
  const { copying, onCopyClick } = useCopy();
  const [shareOpen, setShareOpen] = useState(false);

  const hasCode = code.trim().length > 0;

  const previewUrl = usePreviewUrl(
    themesEnabled ? selectedThemes[0] : undefined
  );

  return (
    <Box className={styles.root}>
      <div className={styles.menuContainer}>
        <HeaderMenu onShareClick={() => setShareOpen(true)} />
      </div>
      <Title />
      <SharedTooltipContext>
        <div
          className={clsx({
            [styles.actionsContainer]: true,
            [styles.actionsReady]: hasCode,
          })}
        >
          <div className={styles.segmentedGroup}>
            <button
              type="button"
              className={styles.segmentedTextButton}
              onClick={() => setShareOpen(true)}
            >
              <Text>Share</Text>
            </button>
            <Tooltip
              label={copying ? 'Copied!' : 'Copy link'}
              trigger={
                <button
                  type="button"
                  aria-label="Copy link"
                  className={styles.segmentedIconButton}
                  onClick={() => onCopyClick(window.location.href)}
                >
                  {copying ? (
                    <span className={styles.copyLinkSuccess}>
                      <Check size={14} />
                    </span>
                  ) : (
                    <Link size={14} />
                  )}
                </button>
              }
            />
          </div>

          {themesEnabled && selectedThemes.length !== 1 ? (
            <Menu
              width="content"
              align="end"
              trigger={<ButtonIcon label="Launch Preview" icon={<Play />} />}
            >
              <MenuGroup label="Choose preview theme">
                {availableThemes.map((theme) => (
                  <MenuItemThemedPreviewLink key={theme} theme={theme} />
                ))}
              </MenuGroup>
            </Menu>
          ) : (
            <ButtonIconLink
              label="Launch Preview"
              icon={<Play />}
              href={previewUrl}
              target="_blank"
            />
          )}

          <Menu
            width="small"
            align="end"
            trigger={
              <ButtonIcon label="Configure frames" icon={<FrameIcon />} />
            }
          >
            <FramesMenu />
          </Menu>
        </div>
        <ShareDialog open={shareOpen} onOpenChange={setShareOpen} />
      </SharedTooltipContext>
    </Box>
  );
};

const ShareCopyButton = ({
  children,
  linkToCopy,
}: {
  children: ReactNode;
  linkToCopy: string;
}) => {
  const { copying, onCopyClick } = useCopy();

  return (
    <Inline space="small" alignY="center">
      <Button onClick={() => onCopyClick(linkToCopy)}>{children}</Button>
      <div role="status" aria-live="assertive">
        {copying ? (
          <Text tone="positive">
            Copied <Check size={14} />
          </Text>
        ) : null}
      </div>
    </Inline>
  );
};

const ShareDialog = ({
  open,
  onOpenChange,
}: Pick<ComponentProps<typeof Dialog>, 'open' | 'onOpenChange'>) => {
  const [{ selectedThemes }] = useContext(StoreContext);
  const defaultTheme =
    selectedThemes.length > 0 ? selectedThemes[0] : themeNames[0];
  const [themeForPreviewShare, setThemeForPreviewShare] =
    useState(defaultTheme);

  const previewUrl = usePreviewUrl(themeForPreviewShare);

  return (
    <Dialog title="Share Playroom" open={open} onOpenChange={onOpenChange}>
      <div style={{ maxWidth: '500px', width: '100%' }}>
        <Stack space="large">
          <Stack space="xlarge">
            <Text tone="secondary">
              Collaborate on your design by sharing a link.
              <br />
              The link includes the selected frames, title, and code.
            </Text>
            <ShareCopyButton linkToCopy={window.location.href}>
              Copy link
            </ShareCopyButton>
          </Stack>

          <hr className={styles.separator} />

          <Stack space="xlarge">
            <Stack space="large">
              <Heading level="3">Preview mode</Heading>
              <Text tone="secondary">
                Share a preview of your design as a standalone prototype — ideal
                for user testing or stakeholder demonstration.
              </Text>
              {themesEnabled ? (
                <ThemeSelector
                  value={themeForPreviewShare}
                  onChange={setThemeForPreviewShare}
                />
              ) : null}
            </Stack>
            <ShareCopyButton linkToCopy={previewUrl}>
              Copy preview link
            </ShareCopyButton>
          </Stack>
        </Stack>
      </div>
    </Dialog>
  );
};
