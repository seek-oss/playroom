import {
  assertPreviewContains,
  cleanUp,
  getFirstFrame,
  typeCode,
  visit,
} from '../support/utils';

const assertGlobalCounter = () => cy.window().its('counter').should('equal', 1);
const assertGlobalCounterInIframe = ($iframe) =>
  cy.wrap($iframe[0].contentWindow).its('counter').should('equal', 1);

describe('Entry', () => {
  afterEach(() => {
    cleanUp();
  });

  describe('single entry', () => {
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

        getFirstFrame().then(($frame) => {
          assertGlobalCounterInIframe($frame);
        });
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

  describe('multiple entries', () => {
    it('loads the entry for frames', () => {
      visit('http://localhost:9001/index.html');
      // introduce some delay to make sure everything loads
      typeCode('-');

      getFirstFrame().then(($frame) => {
        assertGlobalCounterInIframe($frame);
      });
    });

    it('does not load the entry for main app', () => {
      visit('http://localhost:9001/index.html');
      // introduce some delay to make sure everything loads
      typeCode('-');

      cy.window().its('counter').should('not.exist');
    });
  });
});
