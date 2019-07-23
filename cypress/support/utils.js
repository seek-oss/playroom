export const typeCode = code =>
  cy
    .get('.CodeMirror')
    .click()
    .focused()
    .clear({ force: true })
    .type(code, { force: true, delay: 100 })
    .wait(1000);

export const assertFrameContains = async text => {
  const iframe = await cy.get('iframe').first();

  return iframe
    .contents()
    .find('body')
    .contains(text);
};

export const assertCodePaneContains = async text => {
  return cy.get('.react-codemirror2').contains(text);
};
