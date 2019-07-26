beforeEach(async () => {
  // Visit once
  cy.visit('http://localhost:9000');

  // Clear storage
  const win = await cy.window();
  const { storageKey } = win.__playroomConfig__;
  indexedDB.deleteDatabase(storageKey);
});

beforeEach(() => {
  // Visit again with no storage
  cy.visit('http://localhost:9000');
});
