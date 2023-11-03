import { useEffect, useRef, useState } from 'react';
import flatMap from 'lodash/flatMap';
import Iframe from './Iframe';
import {
  compileJsx,
  openFragmentTag,
  closeFragmentTag,
} from '../../utils/compileJsx';
import type { PlayroomProps } from '../Playroom';
import { Strong } from '../Strong/Strong';
import { Text } from '../Text/Text';
import playroomConfig from '../../config';
import frameSrc from './frameSrc';

import * as styles from './Frames.css';

interface FramesProps {
  code: string;
  themes: PlayroomProps['themes'];
  widths: PlayroomProps['widths'];
}

export default function Frames({ code, themes, widths }: FramesProps) {
  const scrollingPanelRef = useRef<HTMLDivElement | null>(null);

  const frames = flatMap(widths, (width) =>
    themes.map((theme) => ({
      theme,
      width,
      widthName: `${width}${/\d$/.test(width.toString()) ? 'px' : ''}`,
    }))
  );

  const [renderCode, setRenderCode] = useState(
    () => `${openFragmentTag}${closeFragmentTag}`
  );

  useEffect(() => {
    try {
      const newCode = compileJsx(code);
      setRenderCode(newCode);
    } catch (e) {}
  }, [code]);

  return (
    <div ref={scrollingPanelRef} className={styles.root}>
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
                { themeName: frame.theme, code: renderCode },
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
    </div>
  );
}
