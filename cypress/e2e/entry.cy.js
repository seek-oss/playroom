import { assertPreviewContains, typeCode, visit } from '../support/utils';

describe('entry', () => {
  const assertGlobalCounter = () =>
    cy.window().its('counter').should('equal', 1);

  describe('loads the entry only once', () => {
    it('for main app', () => {
      cy.visit('http://localhost:9002');
      // introduce some delay to make sure everything loads
      typeCode('-');

      assertGlobalCounter();
    });

    it('for frames', () => {
      visit('http://localhost:9002');
      // introduce some delay to make sure everything loads
      typeCode('-');

      assertGlobalCounter();
    });

    it('for preview', () => {
      cy.visit(
        'http://localhost:9002/preview#code=N4Igxg9gJgpiBcIC0IC%2BQ'
      ).then(() => {
        cy.get('[data-testid="splashscreen"]').should('not.be.visible');
      });
      // wait for rendering to finish to make sure everything loads
      assertPreviewContains('-');

      assertGlobalCounter();
    });
  });
});
