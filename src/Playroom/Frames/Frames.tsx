import { useRef } from 'react';
import Iframe from './Iframe';
import { compileJsx } from '../../utils/compileJsx';
import type { PlayroomProps } from '../Playroom';
import { Strong } from '../Strong/Strong';
import { Text } from '../Text/Text';
import playroomConfig from '../../config';
import frameSrc from './frameSrc';

import * as styles from './Frames.css';
import { Box } from '../Box/Box';

interface FramesProps {
  code: string;
  themes: PlayroomProps['themes'];
  widths: PlayroomProps['widths'];
}

export default function Frames({ code, themes, widths }: FramesProps) {
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
  } catch (e) {}

  return (
    <div ref={scrollingPanelRef} className={styles.root}>
      <Box display="flex" gap="gutter" marginX="auto">
        {frames.map((frame) => (
          <div
            key={`${frame.theme}_${frame.width}`}
            className={styles.frameContainer}
          >
            <div className={styles.frame}>
              <div className={styles.frameBorder} />
              <Iframe
                intersectionRootRef={scrollingPanelRef}
                src={frameSrc(
                  { themeName: frame.theme, code: renderCode.current },
                  playroomConfig
                )}
                className={styles.frame}
                style={{ width: frame.width }}
                data-testid="previewFrame"
              />
            </div>
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
      </Box>
    </div>
  );
}
