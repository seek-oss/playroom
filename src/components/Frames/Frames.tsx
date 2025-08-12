import { assignInlineVars } from '@vanilla-extract/dynamic';
import { useContext, useRef } from 'react';

import playroomConfig from '../../config';
import { themeNames as availableThemes } from '../../configModules/themes';
import availableWidths from '../../configModules/widths';
import { StoreContext } from '../../contexts/StoreContext';
import { compileJsx } from '../../utils/compileJsx';
import { Box } from '../Box/Box';
import { ReceiveErrorMessage } from '../Frame/frameMessaging';
import { Strong } from '../Strong/Strong';
import { Text } from '../Text/Text';

import Iframe from './Iframe';
import frameSrc from './frameSrc';

import * as styles from './Frames.css';

interface FramesProps {
  code: string;
}

export default function Frames({ code }: FramesProps) {
  const [{ visibleWidths, visibleThemes }] = useContext(StoreContext);
  const themes =
    visibleThemes && visibleThemes.length > 0 ? visibleThemes : availableThemes;
  const widths =
    visibleWidths && visibleWidths.length > 0 ? visibleWidths : availableWidths;
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
        <div
          key={`${frame.theme}_${frame.width}`}
          className={styles.frameContainer}
          style={assignInlineVars({
            [styles.frameWidth]:
              frame.width === 'Fit to window' ? '100%' : `${frame.width}px`,
          })}
        >
          <div className={styles.frameName} data-testid="frameName">
            {frame.theme === '__PLAYROOM__NO_THEME__' ? (
              <Text weight="strong">{frame.widthName}</Text>
            ) : (
              <Text>
                {`${frame.widthName} \u2013 `}
                <Strong>{frame.theme}</Strong>
              </Text>
            )}
          </div>
          <Box height="full" position="relative">
            <Iframe
              intersectionRootRef={scrollingPanelRef}
              src={frameSrc(
                { themeName: frame.theme, code: renderCode.current },
                playroomConfig
              )}
              data-testid="frameIframe"
              className={styles.frame}
            />
            <ReceiveErrorMessage />
            <div className={styles.frameBorder} />
          </Box>
        </div>
      ))}
    </div>
  );
}
