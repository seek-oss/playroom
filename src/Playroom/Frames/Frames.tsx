import React, { Fragment, useRef } from 'react';
import flatMap from 'lodash/flatMap';
import Iframe from './Iframe';
import { compileJsx } from '../../utils/compileJsx';
import { PlayroomProps } from '../Playroom';

// @ts-ignore
import styles from './Frames.less';

interface FrameProps {
  code: string;
  themes: PlayroomProps['themes'];
  widths: PlayroomProps['widths'];
}

const playroomConfig = (window.__playroomConfig__ = __PLAYROOM_GLOBAL__CONFIG__);

export default function Frame({ code, themes, widths }: FrameProps) {
  const scrollingPanelRef = useRef<HTMLDivElement | null>(null);

  const frames = flatMap(widths, width =>
    themes.map(theme => ({ theme, width }))
  );

  let renderCode = code;

  try {
    renderCode = compileJsx(code);
  } catch (e) {
    renderCode = '';
  }

  return (
    <div ref={scrollingPanelRef} className={styles.root}>
      {frames.map(frame => (
        <div
          key={`${frame.theme}_${frame.width}`}
          className={styles.frameContainer}
        >
          <div className={styles.frameBorder} />
          <div className={styles.frameName} data-testid="frameName">
            {frame.theme === '__PLAYROOM__NO_THEME__' ? (
              <strong className={styles.strong}>
                {frame.width}
                px
              </strong>
            ) : (
              <Fragment>
                <strong className={styles.strong}>{frame.theme}</strong>
                {` \u2013 ${frame.width}px`}
              </Fragment>
            )}
          </div>
          <Iframe
            intersectionRootRef={scrollingPanelRef}
            src={`${
              playroomConfig.baseUrl
            }frame.html#?themeName=${encodeURIComponent(
              frame.theme
            )}&code=${encodeURIComponent(renderCode)}`}
            className={styles.frame}
            style={{ width: frame.width }}
            data-testid="previewFrame"
          />
        </div>
      ))}
    </div>
  );
}
