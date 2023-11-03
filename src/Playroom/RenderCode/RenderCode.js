import React from 'react';
import scopeEval from 'scope-eval';

// eslint-disable-next-line import/no-unresolved
import useScope from '__PLAYROOM_ALIAS__USE_SCOPE__';

import {
  ReactCreateElementPragma,
  ReactFragmentPragma,
} from '../../utils/compileJsx';

export default function RenderCode({ code, scope }) {
  return scopeEval(code, {
    ...(useScope() ?? {}),
    ...scope,
    React,
    [ReactCreateElementPragma]: React.createElement,
    [ReactFragmentPragma]: React.Fragment,
  });
}
