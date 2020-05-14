require('./commands');
const { getFirstFrame } = require('./utils');

beforeEach(() => {
  cy.visit('http://localhost:9000')
    .window()
    .then((win) => {
      const { storageKey } = win.__playroomConfig__;
      indexedDB.deleteDatabase(storageKey);
    })
    .reload()
    .then(() =>
      getFirstFrame().then(
        ($iframe) =>
          new Cypress.Promise((resolve) => $iframe.on('load', resolve))
      )
    );
});
