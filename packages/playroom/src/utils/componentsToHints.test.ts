import { describe, expect, it } from 'vitest';
/*
componentsToHints uses parsePropTypes,
which has side effects that break tests if they are not imported first

Todo - revisit componentsToHints to optimise
*/

// eslint-disable-next-line import-x/order
import { __private_create_hints } from './componentsToHints.ts';

// @ts-expect-error
import * as PropTypeComponents from '../../../../fixtures/themed/components.jsx';
import * as TypeScriptComponents from '../../../../fixtures/typescript/components.ts';

describe('componentsToHints', () => {
  it('keeps valid component hints when another export has invalid prop types', () => {
    const result = __private_create_hints({
      Invalid: { propTypes: null },
      Foo: PropTypeComponents.Foo,
    });

    expect(Object.keys(result)).toEqual(['Foo']);
    expect(result.Foo.attrs.color).toEqual(['red', 'blue']);
  });

  it('skips factory proxies that do not allow prop type introspection', () => {
    const factory = new Proxy(() => null, {
      get(target, property, receiver) {
        if (property === 'propTypes') {
          throw new TypeError('This export cannot be introspected');
        }
        return Reflect.get(target, property, receiver);
      },
    });
    const result = __private_create_hints({
      Factory: factory,
      Foo: PropTypeComponents.Foo,
    });

    expect(Object.keys(result)).toEqual(['Foo']);
    expect(result.Foo.attrs.color).toEqual(['red', 'blue']);
  });

  it('should support javascript components with proptypes', () => {
    const result = __private_create_hints({
      Bar: PropTypeComponents.Bar,
      Foo: PropTypeComponents.Foo,
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "Bar": {
          "attrs": {
            "color": [
              "red",
              "blue",
            ],
          },
        },
        "Foo": {
          "attrs": {
            "color": [
              "red",
              "blue",
            ],
          },
        },
      }
    `);
  });

  it('should support typescript components when provided with type data', () => {
    const result = __private_create_hints(
      {
        Bar: TypeScriptComponents.Bar,
        Foo: TypeScriptComponents.Foo,
      },
      {
        Bar: { color: ['red', 'blue', 'black'] },
        Foo: { color: ['red', 'blue', 'black'] },
      },
    );

    expect(result).toMatchInlineSnapshot(`
      {
        "Bar": {
          "attrs": {
            "color": [
              "red",
              "blue",
              "black",
            ],
          },
        },
        "Foo": {
          "attrs": {
            "color": [
              "red",
              "blue",
              "black",
            ],
          },
        },
      }
    `);
  });
});
