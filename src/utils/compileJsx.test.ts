import dedent from 'dedent';
import { type ErrorWithLocation, compileJsx, validateCode } from './compileJsx';

describe('compileJsx', () => {
  test('valid code', () => {
    expect(
      compileJsx(dedent`
        <Foo />
        <Bar />
      `)
    ).toMatchInlineSnapshot(`
      "R_cE(R_F, null, R_cE(Foo, null )
      , R_cE(Bar, null ))"
    `);
  });

  test('invalid code - no error', () => {
    expect(
      compileJsx(`
        <Foo--BarBaz ::invalid />
      `)
    ).toMatchInlineSnapshot(
      `"R_cE(R_F, null, R_cE(Foo--BarBaz ::invalid, null ))"`
    );
  });

  test('invalid code - with error', () => {
    expect(() =>
      compileJsx(`
        <Foo />
        <Bar />
        <Foo--BarBaz>
      `)
    ).toThrowErrorMatchingInlineSnapshot(`"Unterminated JSX contents (3:25)"`);
  });
});

describe('validateCode', () => {
  test('valid code', () => {
    expect(
      validateCode(`
        <Foo />
        <Bar />
      `)
    ).toBe(true);
  });

  test('invalid code', () => {
    const error = validateCode(`- line 1
      <Foo />                   - line 2
      <Bar />                   - line 3
      <This is not ::valid />   - line 4
                   ^ column 20
    `);
    expect(error).toMatchInlineSnapshot(
      `[SyntaxError: Unexpected token (4:20)]`
    );
    expect((error as ErrorWithLocation).loc).toMatchInlineSnapshot(`
      Position {
        "column": 20,
        "index": 113,
        "line": 4,
      }
    `);
  });
});
