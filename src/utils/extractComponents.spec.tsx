import React, { Component } from 'react';
import { extractComponents } from './extractComponents';

describe('extractComponents', () => {
  it('rules out values that are definitely not React components', () => {
    const extracted = extractComponents({
      validReactComponent: class extends Component {
        render() {
          return <h1>Hello, World!</h1>;
        }
      },
      otherClass: class {
        render() {
          return <h1>Not a subclass of React.Component</h1>;
        }
      },
      validFunctionComponent: () => <h1>Hello, World!</h1>,
      otherFunction: () => {
        // Not a React function.
      },

      // These values should be ignored.
      nullValue: null,
      numberValue: 123,
      stringValue: 'abc',
      undefinedValue: undefined
    });

    // We unfortunately cannot rule out classes or functions. See implementation
    // for more details.
    expect(Object.keys(extracted)).toEqual([
      'validReactComponent',
      'otherClass',
      'validFunctionComponent',
      'otherFunction'
    ]);
  });
});
