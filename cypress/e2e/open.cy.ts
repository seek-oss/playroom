import {
  assertCodePaneContains,
  assertFirstFrameContains,
  assertStoredPlayrooms,
  assertTitle,
  changeTitle,
  getCodeEditor,
  loadPlayroom,
  openMainMenu,
  openStoredPlayroomByName,
  typeCode,
} from '../support/utils';

describe('Open', () => {
  it('Store and open flow', () => {
    loadPlayroom();

    // Create first design
    changeTitle('First design');
    getCodeEditor().click();
    typeCode('First design');
    assertStoredPlayrooms(1);

    // New playroom
    openMainMenu();
    cy.findByRole('link', { name: 'New Playroom' }).then((link) =>
      cy.visit(link.prop('href'))
    );

    // Create second design
    changeTitle('Second design');
    getCodeEditor().click();
    typeCode('Second design');
    assertStoredPlayrooms(2);

    // Open first design via menu
    openStoredPlayroomByName('First design', { source: 'menu' });
    assertTitle('First design');
    assertCodePaneContains('First design');
    assertFirstFrameContains('First design');

    // Return to second design via keyboard
    openStoredPlayroomByName('Second design', { source: 'keyboard' });
    assertTitle('Second design');
    assertCodePaneContains('Second design');
    assertFirstFrameContains('Second design');
  });
});
