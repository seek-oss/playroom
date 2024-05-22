// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />
import dedent from 'dedent';

import { createUrl } from '../../utils';
import { isMac } from '../../src/utils/formatting';
import type { Direction } from '../../src/Playroom/CodeEditor/keymaps/types';

export const cmdPlus = (keyCombo: string) => {
  const platformSpecificKey = isMac() ? 'cmd' : 'ctrl';
  return `${platformSpecificKey}+${keyCombo}`;
};

const getCodeEditor = () =>
  cy.get('.CodeMirror-code').then((editor) => cy.wrap(editor));

export const getPreviewFrames = () => cy.get('[data-testid="previewFrame"]');

export const getPreviewFrameNames = () => cy.get('[data-testid="frameName"]');

export const typeCode = (code: string, delay?: number) =>
  getCodeEditor().focused().type(code, { delay });

export const formatCode = () =>
  getCodeEditor()
    .focused()
    .type(`${isMac() ? '{cmd}' : '{ctrl}'}s`);

export const selectWidthPreference = (width: number) => {
  cy.findByRole('button', { name: 'Configure visible frames' }).click();
  // Force needed as the checkbox is covered by 'Checkmark' svg
  cy.findByRole('checkbox', { name: `${width}` }).click({ force: true });
};

export const togglePreviewPanel = () =>
  cy.findByRole('button', { name: 'Preview playroom' }).click();

export const gotoPreview = () => {
  togglePreviewPanel();
  cy.findByRole('link', { name: 'Open' }).then(($link) => {
    const url = $link.prop('href');
    cy.visit(url);
  });
};

export const toggleSnippets = () =>
  cy.findByRole('button', { name: /Insert snippet/i }).click();

export const filterSnippets = (search: string) => {
  cy.findByRole('searchbox', { name: 'Search snippets' }).type(search);
};

export const assertSnippetsSearchFieldIsVisible = () =>
  cy.findByRole('searchbox', { name: 'Search snippets' }).should('be.visible');

const getSnippets = () => cy.findByRole('list').find('li');

export const selectSnippetByIndex = (index: number) => getSnippets().eq(index);

export const mouseOverSnippet = (index: number) =>
  // force stops cypress scrolling the panel out of the editor
  selectSnippetByIndex(index).trigger('mousemove', { force: true });

export const assertSnippetCount = (count: number) =>
  getSnippets().should('have.length', count);

export const assertFirstFrameContains = (text: string) =>
  getPreviewFrames()
    .first()
    .its('0.contentDocument.body')
    .should((frameBody) => {
      expect(frameBody.innerText).to.eq(text);
    });

export const selectNextCharacters = (numCharacters: number) => {
  typeCode('{shift+rightArrow}'.repeat(numCharacters));
};

export const selectNextWords = (numWords: number) => {
  const modifier = isMac() ? 'alt' : 'ctrl';
  typeCode(`{shift+${modifier}+rightArrow}`.repeat(numWords));
};

export const selectToStartOfLine = () => {
  typeCode(isMac() ? '{shift+cmd+leftArrow}' : '{shift+home}');
};

export const selectToEndOfLine = () => {
  typeCode(isMac() ? '{shift+cmd+rightArrow}' : '{shift+end}');
};

export const moveBy = (x: number, y: number | undefined = 0) => {
  if (x) {
    const xDirection = x >= 0 ? '{rightArrow}' : '{leftArrow}';
    typeCode(xDirection.repeat(x));
  }

  if (y) {
    const yDirection = y >= 0 ? '{downArrow}' : '{upArrow}';
    typeCode(yDirection.repeat(y));
  }
};

export const moveByWords = (numWords: number) => {
  const modifier = isMac() ? 'alt' : 'ctrl';
  typeCode(`{${modifier}+rightArrow}`.repeat(numWords));
};

export const moveToEndOfLine = () => {
  typeCode(isMac() ? '{cmd+rightArrow}' : '{end}');
};

export const selectNextLines = (
  numLines: number,
  direction: Direction = 'down'
) => {
  const arrowCode = direction === 'down' ? 'downArrow' : 'upArrow';
  typeCode(`{shift+${arrowCode}}`.repeat(numLines));
};

export const assertCodePaneContains = (text: string) => {
  getCodeEditor().within(() => {
    // Accumulate text from individual line elements as they don't include line numbers
    const lines: string[] = [];
    cy.get('.CodeMirror-line').each(($el) => lines.push($el.text()));

    cy.then(() => {
      // removes code mirrors invisible last line character placeholder
      // which is inserted to preserve prettier's new line at end of string.
      const code = lines.join('\n').replace(/[\u200b]$/, '');
      expect(code).to.equal(text);
    });
  });
};

export const assertCodePaneLineCount = (lines: number, wait?: number) => {
  getCodeEditor().within(() =>
    cy.get('.CodeMirror-line').should('have.length', lines)
  );

  // Wait after check to ensure original focus is restored
  if (wait) {
    cy.wait(wait);
  }
};

export const assertFramesMatch = (matches: string[]) =>
  getPreviewFrameNames()
    .should('have.length', matches.length)
    .should((frames) => {
      const frameNames = frames.map((_, el) => el.innerText).toArray();
      return expect(frameNames).to.deep.equal(matches);
    });

export const assertPreviewContains = (text: string) =>
  cy
    .then(() => {
      cy.get('[data-testid="splashscreen"]').should('not.be.visible');
    })
    .get('body')
    .should((el) => {
      expect(el.get(0).innerText).to.eq(text);
    });

export const loadPlayroom = (initialCode?: string) => {
  const baseUrl = 'http://localhost:9000';
  const visitUrl = initialCode
    ? createUrl({ baseUrl, code: dedent(initialCode) })
    : baseUrl;

  return cy.visit(visitUrl).then((window) => {
    const { storageKey } = window.__playroomConfig__;
    indexedDB.deleteDatabase(storageKey);
  });
};

const typeInSearchField = (text: string) =>
  cy.get('.CodeMirror-search-field').type(text);

export const findInCode = (term: string) => {
  // Wait necessary to ensure code pane is focussed
  cy.wait(500); // eslint-disable-line @finsit/cypress/no-unnecessary-waiting
  typeCode(`{${cmdPlus('f')}}`);

  typeInSearchField(`${term}{enter}`);
};

export const replaceInCode = (term: string, replaceWith?: string) => {
  // Wait necessary to ensure code pane is focussed
  cy.wait(500); // eslint-disable-line @finsit/cypress/no-unnecessary-waiting
  typeCode(`{${cmdPlus('alt+f')}}`);
  typeInSearchField(`${term}{enter}`);
  if (replaceWith) {
    typeInSearchField(`${replaceWith}{enter}`);
  }
};

export const jumpToLine = (line: number | string) => {
  // Wait necessary to ensure code pane is focussed
  cy.wait(500); // eslint-disable-line @finsit/cypress/no-unnecessary-waiting
  typeCode(`{${cmdPlus('g')}}`);
  typeCode(`${line}{enter}`);
};

export const assertCodePaneSearchMatchesCount = (lines: number) => {
  getCodeEditor().within(() =>
    cy.get('.cm-searching').should('have.length', lines)
  );
};
