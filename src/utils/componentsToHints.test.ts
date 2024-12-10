import componentsToHints from './componentsToHints';
// @ts-expect-error
import * as PropTypeComponents from '../../cypress/projects/themed/components';
import * as TypeScriptComponents from '../../cypress/projects/typescript/components';

describe('componentsToHints', () => {
  it('should support javascript components with proptypes', () => {
    const result = componentsToHints({
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
    const result = componentsToHints(
      {
        Bar: TypeScriptComponents.Bar,
        Foo: TypeScriptComponents.Foo,
      },
      {
        Bar: { color: ['red', 'blue', 'black'] },
        Foo: { color: ['red', 'blue', 'black'] },
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
