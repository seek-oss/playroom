import {
  type MockInstance,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
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
  let warn: MockInstance<typeof console.warn>;

  beforeEach(() => {
    warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
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

  it('should prefer static types over propTypes without warning', () => {
    const result = __private_create_hints(
      { Foo: PropTypeComponents.Foo },
      { Foo: { color: ['green'] } },
    );

    expect(result).toEqual({ Foo: { attrs: { color: ['green'] } } });
    expect(warn).not.toHaveBeenCalled();
  });

  it('should warn once when falling back to propTypes', () => {
    __private_create_hints({
      Bar: PropTypeComponents.Bar,
      Foo: PropTypeComponents.Foo,
      Baz: TypeScriptComponents.Foo,
    });

    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0][0]).toContain(
      'derived from runtime `propTypes`: Bar, Foo.',
    );
  });

  it('should not warn for components without hints', () => {
    const result = __private_create_hints({
      Bar: TypeScriptComponents.Bar,
      Foo: TypeScriptComponents.Foo,
    });

    expect(result).toEqual({ Bar: { attrs: {} }, Foo: { attrs: {} } });
    expect(warn).not.toHaveBeenCalled();
  });
});
