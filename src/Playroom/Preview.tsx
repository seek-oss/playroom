import type { ComponentType, ReactNode } from 'react';
import lzString from 'lz-string';

import { useParams } from '../utils/params';
import { compileJsx } from '../utils/compileJsx';
import SplashScreen from './SplashScreen/SplashScreen';
import CatchErrors from './CatchErrors/CatchErrors';
// @ts-expect-error
import RenderCode from './RenderCode/RenderCode';

import * as styles from './Preview.css';
import { Helmet } from 'react-helmet';

interface PreviewState {
  code?: string;
  themeName?: string;
  title?: string;
}

export interface PreviewProps {
  components: Record<string, ComponentType>;
  themes: Record<string, any>;
  FrameComponent: ComponentType<{
    themeName: string;
    theme: any;
    children?: ReactNode;
  }>;
}
export default ({ themes, components, FrameComponent }: PreviewProps) => {
  const { themeName, code, title } = useParams((rawParams): PreviewState => {
    const rawCode = rawParams.get('code');
    if (rawCode) {
      const result = JSON.parse(
        lzString.decompressFromEncodedURIComponent(String(rawCode)) ?? ''
      );

      return {
        code: compileJsx(result.code),
        themeName: result.theme,
        title: result.title,
      };
    }

    return {};
  });

  const resolvedTheme = themeName ? themes[themeName] : null;

  return (
    <CatchErrors code={code}>
      <Helmet>
        <title>
          {title ? `${title} | Playroom Preview` : 'Playroom Preview'}
        </title>
      </Helmet>
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
