require('./commands');

beforeEach(() => {
  cy.visit('http://localhost:9000')
    .window()
    .then(win => {
      const { storageKey } = win.__playroomConfig__;
      indexedDB.deleteDatabase(storageKey);
    })
    .visit('http://localhost:9000');
});
