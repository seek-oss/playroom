const getCodeEditor = () => cy.get('.CodeMirror');

export const typeCode = code =>
  getCodeEditor()
    .click()
    .focused()
    .clear({ force: true })
    .type(code, { force: true, delay: 100 })
    .wait(1000);

export const formatCode = () =>
  getCodeEditor()
    .click()
    .focused()
    .type(`${navigator.platform.match('Mac') ? '{cmd}' : '{ctrl}'}s`)
    .wait(1000);

export const assertFrameContains = async text => {
  const iframe = await cy.get('iframe').first();

  iframe
    .contents()
    .find('body')
    .contains(text);
};

export const assertCodePaneContains = text => {
  getCodeEditor().contains(text);
};

export const assertCodePaneLineCount = lines => {
  getCodeEditor().within(() =>
    cy.get('.CodeMirror-line').should('have.length', lines)
  );
};
