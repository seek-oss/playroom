import lzString from 'lz-string';
import { useState, type ComponentType, type ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { compileJsx } from '../utils/compileJsx';
import { useParams } from '../utils/params';

import RenderCode from './RenderCode/RenderCode';
import { ErrorMessage } from './RenderError/RenderError';

const UrlParams = ({
  children,
  themes,
  decodeUrl,
}: {
  themes: Record<string, any>;
  children: (params: {
    themeName: string;
    theme: any;
    code: string;
  }) => ReactNode;
  decodeUrl?: boolean;
}) => {
  const { themeName, code } = useParams((rawParams) => {
    const rawThemeName = rawParams.get('themeName');
    const rawCode = rawParams.get('code');

    if (decodeUrl && rawCode) {
      const result = JSON.parse(
        lzString.decompressFromEncodedURIComponent(String(rawCode)) ?? ''
      );

      return {
        code: compileJsx(result.code),
        themeName: result.theme,
        title: result.title,
      };
    }

    return {
      themeName: rawThemeName || '',
      code: rawCode || '',
    };
  });

  const resolvedThemeName =
    themeName === '__PLAYROOM__NO_THEME__' ? null : themeName;
  const resolvedTheme = resolvedThemeName ? themes[resolvedThemeName] : null;

  return children({
    themeName,
    code,
    theme: resolvedTheme,
  });
};

interface FrameProps {
  themes: Record<string, any>;
  components: Record<string, ComponentType>;
  FrameComponent: ComponentType<{
    themeName: string | null;
    theme: string;
    children?: ReactNode;
  }>;
  ErrorComponent: ComponentType<{ errorMessage: string }>;
  decodeUrl?: boolean;
}
export default function Frame({
  themes,
  components,
  FrameComponent,
  decodeUrl = false,
  ErrorComponent,
}: FrameProps) {
  const [error, setError] = useState('');

  return (
    <UrlParams themes={themes} decodeUrl={decodeUrl}>
      {({ code, themeName, theme }) => (
        <ErrorBoundary
          fallbackRender={() => <ErrorMessage errorMessage={error} />}
          resetKeys={[code]}
          onError={(e) => {
            setError(e.message);
          }}
          onReset={() => {
            setError('');
          }}
        >
          <FrameComponent themeName={themeName} theme={theme}>
            <RenderCode
              code={code}
              components={components}
              onError={setError}
            />
          </FrameComponent>
          <ErrorComponent errorMessage={error} />
        </ErrorBoundary>
      )}
    </UrlParams>
  );
}
