import dedent from 'dedent';
import { compileJsx, validateCode } from './compileJsx';

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
    expect(
      validateCode(`
        <Foo />
        <Bar />
        <FooBarBaz ::invalid />
      `)
    ).toMatchInlineSnapshot(`
      [SyntaxError: unknown: Unexpected token (4:20)

        2 |         <Foo />
        3 |         <Bar />
      > 4 |         <FooBarBaz ::invalid />
          |                     ^
        5 |       </>]
    `);
  });
});
