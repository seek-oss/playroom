import {
  type ComponentProps,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import RenderCode from '../RenderCode/RenderCode';
import { ErrorMessage } from '../RenderError/RenderError';

type RenderCodeProps = ComponentProps<typeof RenderCode>;
type FrameComponentProps = {
  themeName: string | null;
  theme: string;
  children?: ReactNode;
};

interface FrameProps extends Pick<RenderCodeProps, 'code' | 'components'> {
  themeName: FrameComponentProps['themeName'];
  theme: FrameComponentProps['theme'];
  FrameComponent: ComponentType<FrameComponentProps>;
  ErrorComponent: ComponentType<{ errorMessage: string }>;
  decodeUrl?: boolean;
}
export default function Frame({
  code,
  components,
  themeName,
  theme,
  FrameComponent,
  ErrorComponent,
}: FrameProps) {
  const [error, setError] = useState('');

  return (
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
        <RenderCode code={code} components={components} onError={setError} />
      </FrameComponent>
      <ErrorComponent errorMessage={error} />
    </ErrorBoundary>
  );
}
