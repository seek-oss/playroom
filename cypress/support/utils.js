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

export const getPreviewFrames = () => cy.get('[data-testid="previewFrame"]');

export const getPreviewFrameNames = () => cy.get('[data-testid="frameName"]');

export const getFirstFrame = () => getPreviewFrames().first();

export const selectWidthPreferenceByIndex = index =>
  cy
    .get('[data-testid="toggleWidths"]')
    .then(el => el.get(0).click())
    .get('[data-testid="widthsPreferences"] label')
    .eq(index)
    .then(el => el.get(0).click());

export const assertFirstFrameContains = async text => {
  const iframe = await getFirstFrame();

  iframe.contains(text);
};

export const assertCodePaneContains = text => {
  getCodeEditor().contains(text);
};

export const assertCodePaneLineCount = lines => {
  getCodeEditor().within(() =>
    cy.get('.CodeMirror-line').should('have.length', lines)
  );
};

export const assertFramesMatch = matches =>
  getPreviewFrameNames()
    .should('have.length', matches.length)
    .then(frames => {
      const frameNames = frames.map((_, el) => el.innerText).toArray();
      return expect(frameNames).to.deep.equal(matches);
    });
