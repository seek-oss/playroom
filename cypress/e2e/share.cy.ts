import { openMainMenu } from '../support/utils';

describe('Share', () => {
  it('Copy link', () => {
    const url =
      'http://localhost:9000/#?code=N4Igxg9gJgpiBcIA8AxCEB8r1YEIEMAnAei2LUyXJxAF8g';

    cy.visit(url);

    openMainMenu();
    cy.findByRole('menuitem', { name: 'Share' }).click();
    cy.findByRole('dialog', { name: 'Share Playroom' }).should('be.visible');
    cy.findByRole('button', { name: 'Copy link' }).click();

    /**
     * Not using `findByRole` here due to it not discovering the status message
     * Ref: https://github.com/testing-library/cypress-testing-library/issues/205#issue-1037506459
     */
    cy.get('[role=status]').should('contain.text', 'Copied');

    cy.window()
      .its('navigator.clipboard')
      .then((clip) => clip.readText())
      .should('equal', url);
  });

  it('Preview', () => {
    const url =
      'http://localhost:9000/#?code=N4Igxg9gJgpiBcIA8AxCEB8r1YEIEMAnAei2LUyXJxAF8g';
    const previewUrl =
      'http://localhost:9000/preview/#?code=N4Igxg9gJgpiBcIA8AxCEB8r1YEIEMAnAei2LUyXJxAF8g';

    cy.visit(url);

    openMainMenu();
    cy.findByRole('menuitem', { name: 'Share' }).click();
    cy.findByRole('dialog', { name: 'Share Playroom' }).should('be.visible');
    cy.findByRole('button', { name: 'Copy preview link' }).click();

    /**
     * Not using `findByRole` here due to it not discovering the status message
     * Ref: https://github.com/testing-library/cypress-testing-library/issues/205#issue-1037506459
     */
    cy.get('[role=status]').should('contain.text', 'Copied');

    cy.window()
      .its('navigator.clipboard')
      .then((clip) => clip.readText())
      .should('equal', previewUrl);
  });

  it('Preview (themed)', () => {
    const url =
      'http://localhost:9001/?code=N4Igxg9gJgpiBcIA8AxCEB8r1YEIEMAnAei2LUyXJxAF8g';
    const previewUrl =
      'http://localhost:9001/preview/?code=N4Igxg9gJgpiBcIA8AxCEB8r1YEIEMAnAei2LUyXJxABoQAXACxgFs5Fm2YAVAdwggAvkA';

    cy.visit(url);

    openMainMenu();
    cy.findByRole('menuitem', { name: 'Share' }).click();
    cy.findByRole('dialog', { name: 'Share Playroom' }).should('be.visible');
    cy.findByRole('combobox', { name: 'Preview theme' }).select('themeTwo');
    cy.findByRole('button', { name: 'Copy preview link' }).click();

    /**
     * Not using `findByRole` here due to it not discovering the status message
     * Ref: https://github.com/testing-library/cypress-testing-library/issues/205#issue-1037506459
     */
    cy.get('[role=status]').should('contain.text', 'Copied');

    cy.window()
      .its('navigator.clipboard')
      .then((clip) => clip.readText())
      .should('equal', previewUrl);
  });
});
