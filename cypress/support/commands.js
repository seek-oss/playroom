Cypress.Commands.add(
  'getFromPreviewFrame',
  { prevSubject: 'element' },
  ($iframe, selector) =>
    new Promise((resolve) => {
      $iframe.on('load', () => {
        resolve($iframe.contents().find(selector));
      });
    })
);
