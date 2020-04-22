import React, { Fragment, useRef } from 'react';
import flatMap from 'lodash/flatMap';
import Iframe from './Iframe';
import { compileJsx } from '../../utils/compileJsx';
import { PlayroomProps } from '../Playroom';

// @ts-ignore
import styles from './Preview.less';
import ExpandIcon from '../Icons/ExpandIcon';
import usePrototypeUrl from '../../utils/usePrototypeUrl';

interface PreviewProps {
  code: string;
  themes: PlayroomProps['themes'];
  widths: PlayroomProps['widths'];
}

const playroomConfig = (window.__playroomConfig__ = __PLAYROOM_GLOBAL__CONFIG__);

interface FrameDetailsProps {
  theme: string;
  width: number;
}
const FrameDetails = ({ theme, width }: FrameDetailsProps) => {
  const prototypeUrl = usePrototypeUrl(theme);

  return (
    <div className={styles.frameDetails}>
      <div className={styles.frameName} data-testid="frameName">
        {theme === '__PLAYROOM__NO_THEME__' ? (
          <strong className={styles.strong}>
            {width}
            px
          </strong>
        ) : (
          <Fragment>
            <strong className={styles.strong}>{theme}</strong>
            {` \u2013 ${width}px`}
          </Fragment>
        )}
      </div>
      <a href={prototypeUrl} target="_blank" rel="noopener noreferrer">
        <ExpandIcon size={16} />
      </a>
    </div>
  );
};

export default function Preview({ code, themes, widths }: PreviewProps) {
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
          <FrameDetails theme={frame.theme} width={frame.width} />
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
