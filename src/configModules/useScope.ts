import userScopeFromConfig from '__PLAYROOM_ALIAS__USE_SCOPE__';
import React, { createElement, Fragment } from 'react';

import {
  ReactCreateElementPragma,
  ReactFragmentPragma,
} from '../utils/compileJsx';

import components from './components';

const displayContents = { display: 'contents' };

const inspectCreateElement = (type: any, props: any, ...children: any[]) => {
  if (props && props.__source) {
    const { __source, __self, ...restProps } = props;
    const line = __source.lineNumber - 1;
    if (typeof type === 'string') {
      return createElement(
        type,
        { ...restProps, 'data-playroom-line': line },
        ...children
      );
    }
    return createElement(
      'span',
      { 'data-playroom-line': line, style: displayContents },
      createElement(type, restProps, ...children)
    );
  }
  return createElement(type, props, ...children);
};

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
    [ReactCreateElementPragma]: inspectCreateElement,
    [ReactFragmentPragma]: Fragment,
  };
};
