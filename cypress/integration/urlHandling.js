import {
  assertFirstFrameContains,
  assertCodePaneContains,
  assertFramesMatch,
  visit,
} from '../support/utils';

describe('URL handling', () => {
  describe('where paramType is hash', () => {
    it('code', () => {
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

  describe('where paramType is search', () => {
    it('code', () => {
      visit(
        'http://localhost:9001/index.html?code=N4Igxg9gJgpiBcIA8AxCEB8r1YEIEMAnAei2LUyXJxAF8g'
      );

      assertFirstFrameContains('Foo\nFoo\nBar');
      assertCodePaneContains('<Foo><Foo><Bar/></Foo></Foo>');
    });

    it('widths', () => {
      visit(
        'http://localhost:9001/index.html?code=N4Ig7glgJgLgFgZxALgNoGYDsBWANJgNgA4BdAXyA'
      );

      assertFramesMatch([
        'themeOne – 375px',
        'themeTwo – 375px',
        'themeOne – 768px',
        'themeTwo – 768px',
      ]);
    });
  });
});
