// @ts-expect-error virtual module
import userScopeFromConfig from '__PLAYROOM_ALIAS__USE_SCOPE__';
import React, {
  useRef,
  useState,
  useLayoutEffect,
  type ComponentType,
  createElement,
  Fragment,
} from 'react';
import { ErrorBoundary } from 'react-error-boundary';
// @ts-expect-error no types
import scopeEval from 'scope-eval';

import {
  ReactCreateElementPragma,
  ReactFragmentPragma,
} from '../../utils/compileJsx';
import { ErrorMessage } from '../RenderError/RenderError';

interface Props {
  code: string;
  components: Record<string, ComponentType>;
}

const buildScope = (components: Props['components']) => {
  const userScope = {
    ...(userScopeFromConfig() ?? {}),
    ...components,
  };

  if (ReactCreateElementPragma in userScope) {
    throw new Error(
      `'${ReactCreateElementPragma}' is used internally by Playroom and is not allowed in scope`
    );
  }
  if (ReactFragmentPragma in userScope) {
    throw new Error(
      `'${ReactFragmentPragma}' is used internally by Playroom and is not allowed in scope`
    );
  }

  return {
    ...userScope,
    React,
    [ReactCreateElementPragma]: createElement,
    [ReactFragmentPragma]: Fragment,
  };
};

const EvalCode = ({
  code,
  scope,
  onSuccess,
}: {
  code: string;
  scope: Record<string, any>;
  onSuccess?: () => void;
}) => {
  useLayoutEffect(() => {
    if (typeof onSuccess !== 'undefined') {
      onSuccess();
    }
  }, [onSuccess]);

  return scopeEval(code, scope);
};

export default function RenderCode({ code, components }: Props) {
  const lastCode = useRef('');
  const [error, setError] = useState('');

  const onSuccess = () => {
    lastCode.current = code || '';
  };

  const scope = buildScope(components);

  return (
    <>
      <ErrorBoundary
        fallbackRender={() => (
          <EvalCode scope={scope} code={lastCode.current} />
        )}
        resetKeys={[code]}
        onError={(e) => {
          setError(e.message);
        }}
        onReset={() => {
          setError('');
        }}
      >
        <EvalCode scope={scope} code={code} onSuccess={onSuccess} />
      </ErrorBoundary>
      <ErrorMessage>{error}</ErrorMessage>
    </>
  );
}
