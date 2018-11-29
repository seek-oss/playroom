export const typeCode = code =>
  cy
    .get('.CodeMirror')
    .click()
    .focused()
    .clear({ force: true })
    .type(code, { force: true });

export const assertFrameContains = async text => {
  const iframe = await cy.get('iframe').first();

  return iframe
    .contents()
    .find('body')
    .contains(text);
};
