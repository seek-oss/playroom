import lzString from 'lz-string';
import type { ComponentProps, ComponentType, ReactNode } from 'react';
import { Helmet } from 'react-helmet';

import { useParams } from '../utils/params';

import Frame from './Frame';
import { ErrorMessage } from './RenderError/RenderError';
import SplashScreen from './SplashScreen/SplashScreen';
import { Stack } from './Stack/Stack';

import * as styles from './Preview.css';

interface PreviewState {
  title?: string;
}

const PreviewError: ComponentProps<typeof Frame>['ErrorComponent'] = ({
  errorMessage,
}) => (
  <ErrorMessage
    size="large"
    errorMessage={
      errorMessage ? (
        <Stack space="xlarge">
          <>{errorMessage}</>
          <a href={window.location.href.replace('/preview', '')}>
            Edit Playroom
          </a>
        </Stack>
      ) : null
    }
  />
);

export interface PreviewProps {
  components: Record<string, ComponentType>;
  themes: Record<string, any>;
  FrameComponent: ComponentType<{
    themeName: string | null;
    theme: any;
    children?: ReactNode;
  }>;
}
export default ({ themes, components, FrameComponent }: PreviewProps) => {
  const { title } = useParams((rawParams): PreviewState => {
    const rawCode = rawParams.get('code');
    if (rawCode) {
      const result = JSON.parse(
        lzString.decompressFromEncodedURIComponent(String(rawCode)) ?? ''
      );

      return {
        title: result.title,
      };
    }

    return {
      title: '',
    };
  });

  return (
    <>
      <Helmet>
        <title>
          {title ? `${title} | Playroom Preview` : 'Playroom Preview'}
        </title>
      </Helmet>
      <div className={styles.renderContainer}>
        <Frame
          themes={themes}
          components={components}
          FrameComponent={FrameComponent}
          ErrorComponent={PreviewError}
          decodeUrl
        />
      </div>
      <div className={styles.splashScreenContainer}>
        <SplashScreen />
      </div>
    </>
  );
};
