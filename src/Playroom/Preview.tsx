import React, { ComponentType } from 'react';
import lzString from 'lz-string';

import { useParams } from '../utils/params';
import { compileJsx } from '../utils/compileJsx';
import SplashScreen from './SplashScreen/SplashScreen';

// @ts-ignore
import styles from './Preview.less';

// @ts-ignore
import CatchErrors from './CatchErrors/CatchErrors';
// @ts-ignore
import RenderCode from './RenderCode/RenderCode';

interface PreviewState {
  code?: string;
  themeName?: string;
}

export interface PreviewProps {
  components: Record<string, ComponentType>;
  themes: Record<string, any>;
  FrameComponent: ComponentType<{ themeName: string; theme: any }>;
}
export default ({ themes, components, FrameComponent }: PreviewProps) => {
  const { themeName, code } = useParams(
    (rawParams): PreviewState => {
      if (rawParams.code) {
        const result = JSON.parse(
          lzString.decompressFromEncodedURIComponent(String(rawParams.code)) ??
            ''
        );

        return {
          code: compileJsx(result.code),
          themeName: result.theme,
        };
      }

      return {};
    }
  );

  const resolvedTheme = themeName ? themes[themeName] : null;

  return (
    <CatchErrors code={code}>
      <div className={styles.renderContainer}>
        <FrameComponent
          themeName={themeName || '__PLAYROOM__NO_THEME__'}
          theme={resolvedTheme}
        >
          <RenderCode code={code} scope={components} />
        </FrameComponent>
      </div>
      <div className={styles.splashScreenContainer}>
        <SplashScreen />
      </div>
    </CatchErrors>
  );
};
