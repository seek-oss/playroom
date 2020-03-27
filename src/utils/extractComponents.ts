import { ComponentType } from 'react';

/**
 * Extracts valid React components from a module, filtering out other exports
 * such as constants, type definitions, etc.
 */
export function extractComponents(
  module: Record<string, any>
): Record<string, React.ComponentType> {
  const validated: Record<string, ComponentType> = {};
  for (const [key, value] of Object.entries(module)) {
    if (typeof value === 'function') {
      // In case you weren't aware, `typeof class {}` is `"function"`, so this
      // could be either a class or a function.
      //
      // While we can identify React class components fairly easily by checking
      // value.prototype.isReactComponent (see
      // https://reactjs.org/docs/implementation-notes.html), we have no way of
      // knowing whether a function is a React function. That would require
      // knowing its return type. We can't know the return type without either
      // static analysis or invocation (which we can't do because we don't know
      // what props it expects).
      //
      // As a result, we have no choice but to assume that it's a React
      // component.
      validated[key] = value;
    } else {
      // This is not a React component.
    }
  }
  return validated;
}
