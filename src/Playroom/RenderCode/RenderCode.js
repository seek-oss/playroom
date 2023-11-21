import React from 'react';
import scopeEval from 'scope-eval';

// eslint-disable-next-line import/no-unresolved
import useScope from '__PLAYROOM_ALIAS__USE_SCOPE__';

import {
  ReactCreateElementPragma,
  ReactFragmentPragma,
} from '../../utils/compileJsx';

export default function RenderCode({ code, scope }) {
  const userScope = {
    ...(useScope() ?? {}),
    ...scope,
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

  return scopeEval(code, {
    ...userScope,
    React,
    [ReactCreateElementPragma]: React.createElement,
    [ReactFragmentPragma]: React.Fragment,
  });
}
