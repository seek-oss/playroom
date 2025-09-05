import { Tooltip } from '@base-ui-components/react';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import clsx from 'clsx';
import html2canvas from 'html2canvas';
import { Camera, ClipboardCopy, Download } from 'lucide-react';
import {
  type ReactNode,
  type RefObject,
  useContext,
  useRef,
  useState,
} from 'react';

import { themeNames as availableThemes } from '../../configModules/themes';
import availableWidths, { type Widths } from '../../configModules/widths';
import { StoreContext } from '../../contexts/StoreContext';
import { compileJsx } from '../../utils/compileJsx';
import { useCopy } from '../../utils/useCopy';
import usePreviewUrl from '../../utils/usePreviewUrl';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { ReceiveErrorMessage } from '../Frame/frameMessaging';
import { Menu, MenuItem } from '../Menu/Menu';
import { Strong } from '../Strong/Strong';
import { Text } from '../Text/Text';
import PlayIcon from '../icons/PlayIcon';
import ShareIcon from '../icons/ShareIcon';
import TickIcon from '../icons/TickIcon';

import Iframe from './Iframe';
import frameSrc from './frameSrc';

import * as styles from './Frames.css';

const Highlight = ({ children }: { children: ReactNode }) => (
  <span className={styles.highlightOnHover}>{children}</span>
);

const Frame = ({
  frame,
  title,
  code,
  scrollingPanelRef,
}: {
  frame: { theme: string; width: Widths[number]; widthName: string };
  title?: string;
  code: string;
  scrollingPanelRef: RefObject<HTMLDivElement | null>;
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [frameActive, setFrameActive] = useState(false);
  const noTheme = frame.theme === '__PLAYROOM__NO_THEME__';
  const previewUrl = usePreviewUrl(frame.theme);
  const { copying, onCopyClick } = useCopy();

  const screenshotHandler = async () => {
    if (iframeRef.current?.contentDocument?.body) {
      const canvas = await html2canvas(iframeRef.current.contentDocument.body);
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${title || 'Untitled Playroom'} (${
        noTheme ? frame.widthName : `${frame.theme} - ${frame.widthName}`
      }).png`;
      a.style.position = 'absolute';
      a.style.top = '0';
      a.style.opacity = '0';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const copyHandler = async () => {
    if (iframeRef.current?.contentDocument?.body) {
      const canvas = await html2canvas(iframeRef.current.contentDocument.body);
      canvas.toBlob(async (blob) => {
        if (blob) {
          const clipboardItem = new ClipboardItem({ [blob.type]: blob });
          await navigator.clipboard.write([clipboardItem]);
        }
      });
    }
  };

  return (
    <div
      className={clsx({
        [styles.frameContainer]: true,
        [styles.frameActive]: frameActive || copying,
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
          <Text>
            <Highlight>
              <Strong>{frame.theme}</Strong>
              {` \u2013 ${frame.widthName}`}
            </Highlight>
          </Text>
        )}
        <Tooltip.Provider>
          <div className={styles.frameActionsContainer}>
            <ButtonIcon
              size="small"
              tone={copying ? 'positive' : 'accent'}
              icon={copying ? <TickIcon /> : <ShareIcon />}
              label={copying ? 'Copied' : 'Copy preview link'}
              onClick={() => (!copying ? onCopyClick(previewUrl) : undefined)}
            />
            <ButtonIcon
              size="small"
              tone="accent"
              icon={<PlayIcon />}
              label="Open preview"
              onClick={() => {
                const width =
                  frame.width === 'Fit to window' ? '' : frame.width;
                const height = iframeRef.current?.offsetHeight;

                window.open(
                  previewUrl,
                  '_blank',
                  [
                    `popup=${Boolean(width)}`, // popup if not `Fit to window`
                    `width=${width}`,
                    `height=${height}`,
                    `left=${width ? screen.availWidth / 2 - width / 2 : ''}`,
                    `top=${
                      height ? screen.availHeight / 2 - height * 0.75 : ''
                    }`,
                    'noopener',
                    'noreferrer',
                  ].join(',')
                );
              }}
            />
            <Menu
              align="end"
              onOpenChange={setFrameActive}
              width="content"
              trigger={
                <ButtonIcon
                  size="small"
                  tone="accent"
                  icon={<Camera />}
                  label="Take screenshot"
                />
              }
            >
              <MenuItem icon={Download} onClick={screenshotHandler}>
                Download
              </MenuItem>
              <MenuItem icon={ClipboardCopy} onClick={copyHandler}>
                Copy
              </MenuItem>
            </Menu>
          </div>
        </Tooltip.Provider>
      </div>
      <div className={styles.frameWrapper}>
        <div className={styles.frameBorder} />
        <Iframe
          ref={iframeRef}
          intersectionRootRef={scrollingPanelRef}
          src={frameSrc({
            themeName: frame.theme,
            code: compileJsx(code),
          })}
          data-testid="frameIframe"
          className={styles.frame}
        />
        <ReceiveErrorMessage />
      </div>
    </div>
  );
};

interface FramesProps {
  code: string;
}
export default function Frames({ code }: FramesProps) {
  const [{ selectedWidths, selectedThemes, title }] = useContext(StoreContext);
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
    <div ref={scrollingPanelRef} className={styles.root}>
      {frames.map((frame) => (
        <Frame
          key={`${frame.theme}_${frame.width}`}
          frame={frame}
          code={code}
          title={title}
          scrollingPanelRef={scrollingPanelRef}
        />
      ))}
    </div>
  );
}
