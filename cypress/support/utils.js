export const typeCode = code =>
  cy
    .get('.CodeMirror')
    .click()
    .focused()
    .clear({ force: true })
    .type(code, { force: true, delay: 100 });

export const assertFrameContains = async text => {
  const iframe = await cy.get('iframe').first();

  return iframe
    .contents()
    .find('body')
    .contains(text);
};

export const assertTextareaContains = async text => {
  return cy
    .get('textarea')
    .first()
    .contains(text);
};
