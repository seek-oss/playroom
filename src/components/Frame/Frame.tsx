import {
  type ComponentProps,
  useState,
  type ComponentType,
  type ReactNode,
  useRef,
} from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import FrameComponent from '../../configModules/frameComponent';
import RenderCode from '../RenderCode/RenderCode';

type RenderCodeProps = ComponentProps<typeof RenderCode>;
type FrameComponentProps = {
  themeName: string | null;
  theme: string;
  children?: ReactNode;
};

interface FrameProps extends Pick<RenderCodeProps, 'code'> {
  themeName: FrameComponentProps['themeName'];
  theme: FrameComponentProps['theme'];
  ErrorComponent: ComponentType<{ message: string; delayVisibility?: boolean }>;
}
export default function Frame({
  code,
  themeName,
  theme,
  ErrorComponent,
}: FrameProps) {
  const [error, setError] = useState('');
  const delay = useRef(true);

  return (
    <>
      <ErrorBoundary
        fallbackRender={() => {
          /**
           * Handles low-level React errors during rendering (i.e. invalid type
           * of `style` prop value).
           *
           * When this occurs, the last successful render cannot be shown,
           * so we want to display the error message immediately.
           */
          delay.current = false;
          return null;
        }}
        resetKeys={[code]}
        onError={(e) => {
          setError(e.message);
        }}
        onReset={() => {
          setError('');
          delay.current = true;
        }}
      >
        <FrameComponent themeName={themeName} theme={theme}>
          <RenderCode code={code} onError={setError} />
        </FrameComponent>
      </ErrorBoundary>
      <ErrorComponent message={error} delayVisibility={delay.current} />
    </>
  );
}
