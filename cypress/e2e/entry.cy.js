import {
  assertPreviewContains,
  cleanUp,
  getPreviewFrames,
  typeCode,
} from '../support/utils';

const getFirstFrame = () =>
  getPreviewFrames()
    .first()
    .then(cy.wrap)
    .should(
      ($frame) => expect($frame.get(0).contentDocument.body).to.not.be.empty
    );

const assertGlobalCounter = (subject = cy.window()) =>
  subject.its('counter').should('equal', 1);

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
        cy.visit('http://localhost:9002');
        // introduce some delay to make sure everything loads
        typeCode('-');

        assertGlobalCounter(getFirstFrame().its('0.contentWindow'));
      });

      it('for preview', () => {
        cy.visit('http://localhost:9002/preview#code=N4Igxg9gJgpiBcIC0IC%2BQ');
        // wait for rendering to finish to make sure everything loads
        assertPreviewContains('-');

        assertGlobalCounter();
      });
    });
  });

  describe('multiple entries', () => {
    it('loads the entry for frames', () => {
      cy.visit('http://localhost:9001/index.html');
      // introduce some delay to make sure everything loads
      typeCode('-');

      assertGlobalCounter(getFirstFrame().its('0.contentWindow'));
    });

    it('does not load the entry for main app', () => {
      cy.visit('http://localhost:9001/index.html');
      // introduce some delay to make sure everything loads
      typeCode('-');

      cy.window().its('counter').should('not.exist');
    });
  });
});
