import userScopeFromConfig from '__PLAYROOM_ALIAS__USE_SCOPE__';
import React, { createElement, Fragment } from 'react';

import {
  ReactCreateElementPragma,
  ReactFragmentPragma,
} from '../utils/compileJsx';

import components from './components';

export default () => {
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
