import { useRef, useLayoutEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
// @ts-expect-error no types
import scopeEval from 'scope-eval';

import buildScope from '../../configModules/useScope';

interface Props {
  code: string;
  inspectMode: boolean;
  onError: (error: string) => void;
}

const EvalCode = ({
  code,
  inspectMode,
  onSuccess,
}: {
  code: string;
  inspectMode: boolean;
  onSuccess?: () => void;
}) => {
  useLayoutEffect(() => {
    if (typeof onSuccess !== 'undefined') {
      onSuccess();
    }
  }, [onSuccess]);

  return scopeEval(code, buildScope(inspectMode));
};

export default function RenderCode({ code, inspectMode, onError }: Props) {
  const lastCode = useRef('');

  const onSuccess = () => {
    lastCode.current = code || '';
  };

  return (
    <ErrorBoundary
      fallbackRender={() => (
        <EvalCode code={lastCode.current} inspectMode={inspectMode} />
      )}
      resetKeys={[code]}
      onError={(e) => {
        onError(e.message);
      }}
      onReset={() => {
        onError('');
      }}
    >
      <EvalCode code={code} inspectMode={inspectMode} onSuccess={onSuccess} />
    </ErrorBoundary>
  );
}
