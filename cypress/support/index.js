beforeEach(async () => {
  cy.visit('http://localhost:9000');

  const win = await cy.window();
  const { storageKey } = win.__playroomConfig__;
  indexedDB.deleteDatabase(storageKey);
});
