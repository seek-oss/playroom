import {
  assertFirstFrameContains,
  assertCodePaneContains,
  assertFramesMatch,
  visit,
} from '../support/utils';

describe('URL handling', () => {
  it('code (base64 encoding)', () => {
    visit(
      'http://localhost:9000/#?code=PEZvbz48Rm9vPjxCYXIvPjwvRm9vPjwvRm9vPg'
    );

    assertFirstFrameContains('Foo\nFoo\nBar');
    assertCodePaneContains('<Foo><Foo><Bar/></Foo></Foo>');
  });

  it('code (LZ-based compression)', () => {
    visit(
      'http://localhost:9000/#?code=N4Igxg9gJgpiBcIA8AxCEB8r1YEIEMAnAei2LUyXJxAF8g'
    );

    assertFirstFrameContains('Foo\nFoo\nBar');
    assertCodePaneContains('<Foo><Foo><Bar/></Foo></Foo>');
  });

  it('widths', () => {
    visit(
      'http://localhost:9000/#?code=N4Ig7glgJgLgFgZxALgNoGYDsBWANJgNgA4BdAXyA'
    );

    assertFramesMatch(['375px', '768px']);
  });
});
