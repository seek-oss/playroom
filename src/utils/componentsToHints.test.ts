import componentsToHints from './componentsToHints';
// @ts-expect-error
import * as PropTypeComponents from '../../cypress/projects/themed/components';
import * as TypeScriptComponents from '../../cypress/projects/typescript/components';

describe('componentsToHints', () => {
  it('should support javascript components with proptypes', () => {
    const result = componentsToHints({
      Foo: PropTypeComponents.Foo,
      Bar: PropTypeComponents.Bar,
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
    const result = componentsToHints(
      {
        Foo: TypeScriptComponents.Foo,
        Bar: TypeScriptComponents.Bar,
      },
      {
        Foo: { color: ['red', 'blue', 'black'] },
        Bar: { color: ['red', 'blue', 'black'] },
      }
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
