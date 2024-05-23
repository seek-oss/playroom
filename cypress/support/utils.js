// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />
import dedent from 'dedent';

import { createUrl } from '../../utils';
import { isMac } from '../../src/utils/formatting';

export const cmdPlus = (keyCombo) => {
  const platformSpecificKey = isMac() ? 'cmd' : 'ctrl';
  return `${platformSpecificKey}+${keyCombo}`;
};

const getCodeEditor = () =>
  cy.get('.CodeMirror-code').then((editor) => cy.wrap(editor));

export const getPreviewFrames = () => cy.get('[data-testid="previewFrame"]');

export const getPreviewFrameNames = () => cy.get('[data-testid="frameName"]');

export const typeCode = (code, { delay } = {}) =>
  getCodeEditor().focused().type(code, { delay });

export const formatCode = () =>
  getCodeEditor()
    .focused()
    .type(`${isMac() ? '{cmd}' : '{ctrl}'}s`);

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
  cy.get('[data-testid="filterSnippets"]').type(search);
};

export const assertSnippetsListIsVisible = () =>
  cy.get('[data-testid="snippets"]').should('be.visible');

const getSnippets = () => cy.get('[data-testid="snippet-list"] li');

export const selectSnippetByIndex = (index) => getSnippets().eq(index);

export const mouseOverSnippet = (index) =>
  // force stops cypress scrolling the panel out of the editor
  selectSnippetByIndex(index).trigger('mousemove', { force: true });

export const assertSnippetCount = (count) =>
  getSnippets().should('have.length', count);

export const assertFirstFrameContains = (text) =>
  getPreviewFrames()
    .first()
    .its('0.contentDocument.body')
    .should((frameBody) => {
      expect(frameBody.innerText).to.eq(text);
    });

/**
 * @param {number} numCharacters
 */
export const selectNextCharacters = (numCharacters) => {
  typeCode('{shift+rightArrow}'.repeat(numCharacters));
};

/**
 * @param {number} numWords
 */
export const selectNextWords = (numWords) => {
  const modifier = isMac() ? 'alt' : 'ctrl';
  typeCode(`{shift+${modifier}+rightArrow}`.repeat(numWords));
};

export const selectToStartOfLine = () => {
  typeCode(isMac() ? '{shift+cmd+leftArrow}' : '{shift+home}');
};

export const selectToEndOfLine = () => {
  typeCode(isMac() ? '{shift+cmd+rightArrow}' : '{shift+end}');
};

/**
 * @param {number} x;
 * @param {number | undefined} y
 */
export const moveBy = (x, y = 0) => {
  if (x) {
    const xDirection = x >= 0 ? '{rightArrow}' : '{leftArrow}';
    typeCode(xDirection.repeat(x));
  }

  if (y) {
    const yDirection = y >= 0 ? '{downArrow}' : '{upArrow}';
    typeCode(yDirection.repeat(y));
  }
};

/**
 * @param {number} numWords
 */
export const moveByWords = (numWords) => {
  const modifier = isMac() ? 'alt' : 'ctrl';
  typeCode(`{${modifier}+rightArrow}`.repeat(numWords));
};

export const moveToEndOfLine = () => {
  typeCode(isMac() ? '{cmd+rightArrow}' : '{end}');
};

/**
 * @typedef {import('../../src/Playroom/CodeEditor/keymaps/types').Direction} Direction
 */
/**
 * @param {number}    numLines
 * @param {Direction} direction
 */
export const selectNextLines = (numLines, direction = 'down') => {
  const arrowCode = direction === 'down' ? 'downArrow' : 'upArrow';
  typeCode(`{shift+${arrowCode}}`.repeat(numLines));
};

export const assertCodePaneContains = (text) => {
  getCodeEditor().within(() => {
    // Accumulate text from individual line elements as they don't include line numbers
    const lines = [];
    cy.get('.CodeMirror-line').each(($el) => lines.push($el.text()));

    cy.then(() => {
      // removes code mirrors invisible last line character placeholder
      // which is inserted to preserve prettier's new line at end of string.
      const code = lines.join('\n').replace(/[\u200b]$/, '');
      expect(code).to.equal(text);
    });
  });
};

export const assertCodePaneLineCount = (lines, { wait } = {}) => {
  getCodeEditor().within(() =>
    cy.get('.CodeMirror-line').should('have.length', lines)
  );

  // Wait after check to ensure original focus is restored
  if (typeof wait === 'number') {
    cy.wait(wait);
  }
};

export const assertFramesMatch = (matches) =>
  getPreviewFrameNames()
    .should('have.length', matches.length)
    .should((frames) => {
      const frameNames = frames.map((_, el) => el.innerText).toArray();
      return expect(frameNames).to.deep.equal(matches);
    });

export const assertPreviewContains = (text) =>
  cy
    .then(() => {
      cy.get('[data-testid="splashscreen"]').should('not.be.visible');
    })
    .get('body')
    .should((el) => {
      expect(el.get(0).innerText).to.eq(text);
    });

export const cleanUp = () =>
  cy.window().then((win) => {
    const { storageKey } = win.__playroomConfig__;
    indexedDB.deleteDatabase(storageKey);
  });

export const loadPlayroom = (initialCode) => {
  const baseUrl = 'http://localhost:9000';
  const visitUrl = initialCode
    ? createUrl({ baseUrl, code: dedent(initialCode) })
    : baseUrl;

  cy.visit(visitUrl);
  cleanUp();
};

const typeInSearchField = (text) =>
  cy.get('.CodeMirror-search-field').type(text);

/**
 * @param {string} term
 */
export const findInCode = (term) => {
  // Wait necessary to ensure code pane is focussed
  cy.wait(500); // eslint-disable-line @finsit/cypress/no-unnecessary-waiting
  typeCode(`{${cmdPlus('f')}}`);

  typeInSearchField(`${term}{enter}`);
};

/**
 * @param {string} term
 * @param {string} [replaceWith]
 */
export const replaceInCode = (term, replaceWith) => {
  // Wait necessary to ensure code pane is focussed
  cy.wait(500); // eslint-disable-line @finsit/cypress/no-unnecessary-waiting
  typeCode(`{${cmdPlus('alt+f')}}`);
  typeInSearchField(`${term}{enter}`);
  if (replaceWith) {
    typeInSearchField(`${replaceWith}{enter}`);
  }
};

/**
 * @param {number} line
 */
export const jumpToLine = (line) => {
  // Wait necessary to ensure code pane is focussed
  cy.wait(500); // eslint-disable-line @finsit/cypress/no-unnecessary-waiting
  typeCode(`{${cmdPlus('g')}}`);
  typeCode(`${line}{enter}`);
};

/**
 * @param {number} lines
 */
export const assertCodePaneSearchMatchesCount = (lines) => {
  getCodeEditor().within(() =>
    cy.get('.cm-searching').should('have.length', lines)
  );
};
