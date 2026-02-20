import { assignInlineVars } from '@vanilla-extract/dynamic';
import clsx from 'clsx';
import {
  // Camera,
  // ClipboardCopy,
  // Download,
  PictureInPicture2,
  Settings2,
} from 'lucide-react';
import {
  type ReactNode,
  type RefObject,
  useContext,
  useRef,
  useState,
} from 'react';

import type { FrameSettingsValues } from '../../../utils';
import playroomConfig from '../../config';
import { themeNames as availableThemes } from '../../configModules/themes';
import availableWidths, { type Widths } from '../../configModules/widths';
import { StoreContext } from '../../contexts/StoreContext';
import { compileJsx } from '../../utils/compileJsx';
import usePreviewUrl from '../../utils/usePreviewUrl';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import {
  ErrorMessageReceiver,
  // screenshotMessageSender,
} from '../Frame/frameMessenger';
import { Menu, MenuCheckboxItem } from '../Menu/Menu';
import { ScrollContainer } from '../ScrollContainer/ScrollContainer';
import { Strong } from '../Strong/Strong';
import { Text } from '../Text/Text';
import { SharedTooltipContext } from '../Tooltip/Tooltip';

import Iframe from './Iframe';
import frameSrc from './frameSrc';

import * as styles from './Frames.css';

const { frameSettings: availableFrameSettings = [] } = playroomConfig;

const Highlight = ({ children }: { children: ReactNode }) => (
  <span className={styles.highlightOnHover}>{children}</span>
);

export const popOutWindowName = 'standalone_playroom_frame';

const Frame = ({
  frame,
  // title,
  code,
  scrollingPanelRef,
  frameId,
  frameSettings = {},
  dispatch,
}: {
  frame: { theme: string; width: Widths[number]; widthName: string };
  title?: string;
  code: string;
  scrollingPanelRef: RefObject<HTMLDivElement | null>;
  frameId: string;
  frameSettings: FrameSettingsValues;
  dispatch: (action: any) => void;
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [frameActive, setFrameActive] = useState(false);
  const noTheme = frame.theme === '__PLAYROOM__NO_THEME__';
  const previewUrl = usePreviewUrl(frame.theme);

  // const downloadHandler = () => {
  //   if (iframeRef.current?.contentWindow) {
  //     screenshotMessageSender({
  //       messageWindow: iframeRef.current.contentWindow,
  //       action: 'download',
  //       fileName: `${title || 'Untitled Playroom'} (${
  //         noTheme ? frame.widthName : `${frame.theme} - ${frame.widthName}`
  //       })`,
  //     });
  //   }
  // };

  // const copyHandler = () => {
  //   if (iframeRef.current?.contentWindow) {
  //     screenshotMessageSender({
  //       messageWindow: iframeRef.current.contentWindow,
  //       action: 'copy',
  //     });
  //   }
  // };

  return (
    <div
      className={clsx({
        [styles.frameContainer]: true,
        [styles.frameActive]: frameActive,
      })}
      style={assignInlineVars({
        [styles.frameWidth]:
          frame.width === 'Fit to window' ? '100%' : `${frame.width}px`,
      })}
    >
      <div className={styles.frameHeadingContainer} data-testid="frameName">
        {noTheme ? (
          <Text weight="strong">
            <Highlight>{frame.widthName}</Highlight>
          </Text>
        ) : (
          <Text tone="secondary">
            <Highlight>
              <Strong>{frame.theme}</Strong>
              {` \u2013 ${frame.widthName}`}
            </Highlight>
          </Text>
        )}
        <SharedTooltipContext>
          <div className={styles.frameActionsContainer}>
            <ButtonIcon
              tone="accent"
              variant="transparent"
              size="small"
              bleed
              icon={<PictureInPicture2 />}
              label="Pop out frame"
              onClick={() => {
                const width =
                  frame.width === 'Fit to window'
                    ? iframeRef.current?.offsetWidth
                    : frame.width;
                const height = iframeRef.current?.offsetHeight;

                window.open(
                  previewUrl,
                  // Providing a `name` to check and in Preview and not show the header.
                  popOutWindowName,
                  [
                    `popup=true`,
                    `width=${width}`,
                    `height=${height}`,
                    `left=${width ? screen.availWidth / 2 - width / 2 : ''}`,
                    `top=${
                      height ? screen.availHeight / 2 - height * 0.75 : ''
                    }`,
                  ].join(',')
                  /**
                   * Not setting `noopener` and `noreferrer` so we can control the popup
                   * dimensions in Safari.
                   */
                );
              }}
            />

            {availableFrameSettings.length > 0 && (
              <Menu
                onOpenChange={setFrameActive}
                align="end"
                width="content"
                sideOffset={3}
                trigger={
                  <ButtonIcon
                    tone="accent"
                    variant="transparent"
                    size="small"
                    bleed
                    icon={<Settings2 />}
                    label="Frame settings"
                  />
                }
              >
                {availableFrameSettings.map((setting) => (
                  <MenuCheckboxItem
                    key={setting.id}
                    checked={frameSettings[setting.id] ?? setting.defaultValue}
                    onCheckedChange={(checked) => {
                      dispatch({
                        type: 'updateFrameSetting',
                        payload: {
                          frameId,
                          settingId: setting.id,
                          value: checked,
                        },
                      });
                    }}
                  >
                    {setting.label}
                  </MenuCheckboxItem>
                ))}
              </Menu>
            )}

            {/* <Menu
              align="end"
              onOpenChange={setFrameActive}
              width="content"
              trigger={
                <FrameActionButton
                  tone="accent"
                  icon={<Camera />}
                  label="Screenshot"
                />
              }
            >
              <MenuItem icon={Download} onClick={downloadHandler}>
                Download
              </MenuItem>
              <MenuItem icon={ClipboardCopy} onClick={copyHandler}>
                Copy
              </MenuItem>
            </Menu> */}
          </div>
        </SharedTooltipContext>
      </div>
      <div className={styles.frameWrapper}>
        <Iframe
          ref={iframeRef}
          intersectionRootRef={scrollingPanelRef}
          src={frameSrc({
            themeName: frame.theme,
            code,
            frameSettings,
          })}
          data-testid="frameIframe"
          rootMargin="800px"
          className={styles.frame}
        />
        <ErrorMessageReceiver />
      </div>
    </div>
  );
};

interface FramesProps {
  code: string;
}
export default function Frames({ code }: FramesProps) {
  const [{ selectedWidths, selectedThemes, title, frameSettings }, dispatch] =
    useContext(StoreContext);
  const themes = selectedThemes.length > 0 ? selectedThemes : availableThemes;
  const widths = selectedWidths.length > 0 ? selectedWidths : availableWidths;
  const scrollingPanelRef = useRef<HTMLDivElement | null>(null);
  const renderCode = useRef<string>('');

  const frames = widths.flatMap((width) =>
    themes.map((theme) => ({
      theme,
      width,
      widthName: `${width}${/\d$/.test(width.toString()) ? 'px' : ''}`,
    }))
  );

  try {
    renderCode.current = compileJsx(code);
  } catch {}
  return (
    <ScrollContainer
      ref={scrollingPanelRef}
      direction="horizontal"
      fadeSize="small"
    >
      <div className={styles.root}>
        {frames.map((frame) => {
          const frameId = `${frame.theme}-${frame.width}`;

          return (
            <Frame
              key={frameId}
              frame={frame}
              code={renderCode.current}
              title={title}
              scrollingPanelRef={scrollingPanelRef}
              frameId={frameId}
              frameSettings={frameSettings[frameId]}
              dispatch={dispatch}
            />
          );
        })}
      </div>
    </ScrollContainer>
  );
}
