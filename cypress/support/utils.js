const getCodeEditor = () => cy.get('.react-codemirror2');

export const typeCode = code =>
  getCodeEditor()
    .click()
    .focused()
    .clear({ force: true })
    .type(code, { force: true, delay: 100 })
    .wait(1000);

export const formatCode = () =>
  getCodeEditor()
    .focused()
    .type('{meta}s')
    .wait(10000);

export const assertFrameContains = async text => {
  const iframe = await cy.get('iframe').first();

  return iframe
    .contents()
    .find('body')
    .contains(text);
};

export const assertCodePaneContains = async text =>
  getCodeEditor().contains(text);

export const assertCodePaneLineCount = async lines =>
  getCodeEditor().within(() =>
    cy.get('.CodeMirror-line').should('have.length', lines)
  );
