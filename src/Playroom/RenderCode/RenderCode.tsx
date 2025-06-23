import { useRef, useLayoutEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
// @ts-expect-error no types
import scopeEval from 'scope-eval';

import scope from '../../configModules/useScope';

interface Props {
  code: string;
  onError: (error: string) => void;
}

const EvalCode = ({
  code,
  onSuccess,
}: {
  code: string;
  onSuccess?: () => void;
}) => {
  useLayoutEffect(() => {
    if (typeof onSuccess !== 'undefined') {
      onSuccess();
    }
  }, [onSuccess]);

  return scopeEval(code, scope);
};

export default function RenderCode({ code, onError }: Props) {
  const lastCode = useRef('');

  const onSuccess = () => {
    lastCode.current = code || '';
  };

  return (
    <ErrorBoundary
      fallbackRender={() => <EvalCode code={lastCode.current} />}
      resetKeys={[code]}
      onError={(e) => {
        onError(e.message);
      }}
      onReset={() => {
        onError('');
      }}
    >
      <EvalCode code={code} onSuccess={onSuccess} />
    </ErrorBoundary>
  );
}
