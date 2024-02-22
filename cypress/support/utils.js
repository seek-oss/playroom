// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />
import dedent from 'dedent';

import { createUrl } from '../../utils';
import { isMac } from '../../src/utils/formatting';

const WAIT_FOR_FRAME_TO_RENDER = 1000;

const getCodeEditor = () => cy.get('.CodeMirror-code');

export const getPreviewFrames = () => cy.get('[data-testid="previewFrame"]');

export const getPreviewFrameNames = () => cy.get('[data-testid="frameName"]');

export const getFirstFrame = () => getPreviewFrames().first();

export const visit = (url) =>
  cy
    .visit(url)
    .reload()
    .then(() => {
      getFirstFrame().then(
        ($iframe) =>
          new Cypress.Promise((resolve) => $iframe.on('load', resolve))
      );
    });

export const typeCode = (code) =>
  getCodeEditor().focused().type(code, { force: true });

export const typeCodeWithDelay = (code, { delay = 200 } = {}) =>
  getCodeEditor()
    .focused()
    .type(code, { force: true, delay })
    .wait(WAIT_FOR_FRAME_TO_RENDER);

export const formatCode = () =>
  getCodeEditor()
    .focused()
    .type(`${isMac() ? '{cmd}' : '{ctrl}'}s`);
// .wait(WAIT_FOR_FRAME_TO_RENDER);

export const selectWidthPreferenceByIndex = (index) =>
  cy
    .get('[data-testid="toggleFrames"]')
    .then((el) => el.get(0).click())
    .get('[data-testid="widthsPreferences"] label')
    .eq(index)
    .then((el) => el.get(0).click());

export const togglePreviewPanel = () =>
  cy.get('[data-testid="togglePreview"]').then((el) => el.get(0).click());

export const gotoPreview = () => {
  togglePreviewPanel()
    .get('[data-testid="view-prototype"]')
    .then((el) => cy.visit(el.get(0).href));
};

export const toggleSnippets = () =>
  cy.get('[data-testid="toggleSnippets"]').click();

export const filterSnippets = (search) => {
  cy.get('[data-testid="filterSnippets"]').type(search, { force: true });
  // Todo - check if this wait necessary
  // eslint-disable-next-line @finsit/cypress/no-unnecessary-waiting
  cy.wait(200);
};

export const assertSnippetsListIsVisible = () =>
  cy.get('[data-testid="snippets"]').should('be.visible');

const getSnippets = () => cy.get('[data-testid="snippet-list"] li');

export const selectSnippetByIndex = (index) => getSnippets().eq(index);

export const mouseOverSnippet = (index) =>
  selectSnippetByIndex(index)
    .trigger('mousemove', { force: true }) // force stops cypress scrolling the panel out of the editor
    .wait(WAIT_FOR_FRAME_TO_RENDER);

export const assertSnippetCount = (count) =>
  getSnippets().should('have.length', count);

export const assertFirstFrameContains = (text) => {
  getFirstFrame().then(($el) =>
    // eslint-disable-next-line @finsit/cypress/no-unnecessary-waiting
    cy
      .wrap($el.contents().find('body'))
      .wait(WAIT_FOR_FRAME_TO_RENDER)
      .then((el) => {
        expect(el.get(0).innerText).to.eq(text);
      })
  );
};

export const selectNextCharacters = (numCharacters) => {
  typeCode('{shift+rightArrow}'.repeat(numCharacters));
};

export const selectNextWords = (numWords) => {
  const modifier = isMac() ? 'alt' : 'ctrl';
  typeCode(`{shift+${modifier}+rightArrow}`.repeat(numWords));
};

export const selectToEndOfLine = () => {
  typeCode(isMac() ? '{shift+cmd+rightArrow}' : '{shift+end}');
};

/**
 * @typedef {import('../../src/Playroom/CodeEditor/keymaps/types').Direction} Direction
 */
/**
 * @param {number}    numLines
 * @param {Direction} direction
 */
export const selectLines = (numLines, direction = 'down') => {
  const arrowCode = direction === 'down' ? 'downArrow' : 'upArrow';
  typeCode(`{shift+${arrowCode}}`.repeat(numLines));
};

export const assertCodePaneContains = (text) => {
  getCodeEditor().within(() => {
    const lines = [];
    cy.get('.CodeMirror-line').each(($el) => lines.push($el.text()));
    cy.then(() => {
      const code = lines.join('\n');
      // removes code mirrors invisible last line character placeholder
      // which is inserted to preserve prettiers new line at end of string.
      expect(code.replace(/[\u200b]$/, '')).to.eq(text);
    });
  });
};

export const assertCodePaneLineCount = (lines) => {
  getCodeEditor().within(() =>
    cy.get('.CodeMirror-line').should('have.length', lines)
  );
};

export const assertFramesMatch = (matches) =>
  getPreviewFrameNames()
    .should('have.length', matches.length)
    .then((frames) => {
      const frameNames = frames.map((_, el) => el.innerText).toArray();
      return expect(frameNames).to.deep.equal(matches);
    });

export const assertPreviewContains = (text) =>
  cy
    .then(() => {
      cy.get('[data-testid="splashscreen"]').should('not.be.visible');
    })
    .get('body')
    .then((el) => {
      expect(el.get(0).innerText).to.eq(text);
    });

export const loadPlayroom = (initialCode) => {
  const baseUrl = 'http://localhost:9000';
  const visitUrl = initialCode
    ? createUrl({ baseUrl, code: dedent(initialCode) })
    : baseUrl;

  return cy
    .visit(visitUrl)
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
};
