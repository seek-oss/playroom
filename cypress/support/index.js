beforeEach(() => {
  cy.visit('http://localhost:9000');
  indexedDB.deleteDatabase('playroom');
});
