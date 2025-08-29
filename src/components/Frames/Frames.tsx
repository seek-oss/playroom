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
  const [{ selectedWidths, selectedThemes }] = useContext(StoreContext);
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
        <div
          key={`${frame.theme}_${frame.width}`}
          className={styles.frameContainer}
          style={assignInlineVars({
            [styles.frameWidth]:
              frame.width === 'Fit to window' ? '100%' : `${frame.width}px`,
          })}
        >
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
          <div className={styles.frameName} data-testid="frameName">
            {frame.theme === '__PLAYROOM__NO_THEME__' ? (
              <Text weight="strong">{frame.widthName}</Text>
            ) : (
              <Text>
                <Strong>{frame.theme}</Strong>
                {` \u2013 ${frame.widthName}`}
              </Text>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
