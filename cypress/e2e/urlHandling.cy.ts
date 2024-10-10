import {
  assertFirstFrameContains,
  assertCodePaneContains,
  assertFramesMatch,
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

      assertFramesMatch([375, 768]);
    });

    it('title', () => {
      cy.visit(
        'http://localhost:9000/#?code=N4Ig7glgJgLgFgZxALgNoF0A0IYRgGwFMUQAVQhGEAXyA'
      );

      cy.title().should('eq', 'Test | Playroom');
    });

    it('editor hidden', () => {
      cy.visit(
        'http://localhost:9000/#?code=N4IgpgJglgLg9gJwBJQhMA7EAuGCCuYAvkA'
      );

      cy.get('textarea').should('not.be.focused');

      // Todo - write a test that checks the CodeMirror element is not visible
      /*
      The CodeMirror element is not visible, but it is in the DOM
      This test fails because the element doesn't meet Cypress's requirements for being hidden
      Not sure why Cypress's hidden requirement isn't met
      https://docs.cypress.io/guides/core-concepts/interacting-with-elements#An-element-is-considered-hidden-if
      */
      // cy.get('.CodeMirror-code').should('be.hidden');
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

      assertFramesMatch([
        ['themeOne', 375],
        ['themeTwo', 375],
        ['themeOne', 768],
        ['themeTwo', 768],
      ]);
    });

    it('title', () => {
      cy.visit(
        'http://localhost:9001/?code=N4Ig7glgJgLgFgZxALgNoF0A0IYRgGwFMUQAVQhGEAXyA'
      );

      cy.title().should('eq', 'Test | Playroom');
    });

    it('editor hidden', () => {
      cy.visit(
        'http://localhost:9001/?code=N4IgpgJglgLg9gJwBJQhMA7EAuGCCuYAvkA'
      );

      cy.get('textarea').should('not.be.focused');

      // Todo - write a test that checks the CodeMirror element is not visible
    });
  });
});
