import userScopeFromConfig from '__PLAYROOM_ALIAS__USE_SCOPE__';
import React, { createElement, Fragment } from 'react';

import {
  ReactCreateElementPragma,
  ReactFragmentPragma,
} from '../utils/compileJsx';

import components from './components';

const createInspectElement =
  (active: boolean) =>
  (type: any, props: any, ...children: any[]) => {
    if (props && props.__source) {
      const { __source, __self, ...restProps } = props;
      if (active) {
        const line = __source.lineNumber - 1;
        const lineProp = {
          [typeof type === 'string' ? 'data-playroomline' : '__playroomLine']:
            line,
        };
        return createElement(type, { ...restProps, ...lineProp }, ...children);
      }
      return createElement(type, restProps, ...children);
    }
    return createElement(type, props, ...children);
  };

export default (inspectMode = false) => {
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
    [ReactCreateElementPragma]: createInspectElement(inspectMode),
    [ReactFragmentPragma]: Fragment,
  };
};
