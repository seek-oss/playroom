import {
  assertFirstFrameContains,
  assertCodePaneContains,
  assertFramesMatch,
  typeCode,
  assertTitle,
} from '../support/utils';

describe('URL handling', () => {
  describe('where paramType is hash', () => {
    it('code', () => {
      cy.visit(
        'http://localhost:9000/#?code=N4Igxg9gJgpiBcIA8AxCEB8r1YEIEMAnAei2LUyXJxAF8g'
      );

      assertFirstFrameContains('Foo\nFoo\nBar');
      assertCodePaneContains('<Foo><Foo><Bar/></Foo></Foo>');
    });

    it('widths', () => {
      cy.visit(
        'http://localhost:9000/#?code=N4Ig7glgJgLgFgZxALgNoGYDsBWANJgNgA4BdAXyA'
      );

      typeCode('code');
      assertFramesMatch([375, 768]);
    });

    it('title', () => {
      cy.visit(
        'http://localhost:9000/#?code=N4Ig7glgJgLgFgZxALgNoF0A0IYRgGwFMUQAVQhGEAXyA'
      );

      assertTitle('Test');
      cy.title().should('eq', 'Test | Playroom');
    });

    it('editor hidden', () => {
      cy.visit(
        'http://localhost:9000/#?code=N4IgpgJglgLg9gJwBJQhMA7EAuGCCuYAvkA'
      );

      cy.get('textarea').should('not.be.focused');
      cy.get('.CodeMirror-code').should('be.hidden');
    });
  });

  describe('where paramType is search', () => {
    it('code', () => {
      cy.visit(
        'http://localhost:9001/?code=N4Igxg9gJgpiBcIA8AxCEB8r1YEIEMAnAei2LUyXJxAF8g'
      );

      assertFirstFrameContains('Foo\nFoo\nBar');
      assertCodePaneContains('<Foo><Foo><Bar/></Foo></Foo>');
    });

    it('widths and themes', () => {
      cy.visit(
        'http://localhost:9001/?code=N4Ig7glgJgLgFgZxALgNoGYDsBWANJgNgA4BdAXyA'
      );

      typeCode('code');
      assertFramesMatch([
        ['themeOne', 375],
        ['themeTwo', 375],
        ['themeOne', 768],
        ['themeTwo', 768],
      ]);
    });

    it('edit title', () => {
      cy.visit(
        'http://localhost:9001/?code=N4Ig7glgJgLgFgZxALgNoF0A0IYRgGwFMUQAVQhGEAXyA'
      );

      assertTitle('Test');
      cy.title().should('eq', 'Test | Playroom');
    });

    it('preview title', () => {
      cy.visit(
        'http://localhost:9001/preview/?code=N4Igxg9gJgpiBcIA8AxCEB8aJIPTYwB0A7EAGhABcALGAWzkRvpgHli4LKBLSgG0YgAKjADOlEAF8gA'
      );

      cy.title().should('eq', 'Test | Playroom Preview');
    });

    it('editor hidden', () => {
      cy.visit(
        'http://localhost:9001/?code=N4IgpgJglgLg9gJwBJQhMA7EAuGCCuYAvkA'
      );

      cy.get('textarea').should('not.be.focused');
      cy.get('.CodeMirror-code').should('be.hidden');
    });
  });
});
