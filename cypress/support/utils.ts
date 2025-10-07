// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />
import dedent from 'dedent';

import type { Direction } from '../../src/components/CodeEditor/keymaps/types';
import type { Widths } from '../../src/configModules/widths';
import { isMac } from '../../src/utils/formatting';
import { createUrl } from '../../utils';

const CYPRESS_DEFAULT_WAIT_TIME = 500;

const selectModifier = isMac() ? 'cmd' : 'ctrl';
const navigationModifier = isMac() ? 'alt' : 'ctrl';

export const cmdPlus = (keyCombo: string) => {
  const platformSpecificKey = isMac() ? 'cmd' : 'ctrl';
  return `${platformSpecificKey}+${keyCombo}`;
};

const getCodeEditor = () =>
  cy.get('.CodeMirror-code').then((editor) => cy.wrap(editor));

export const getFrames = () => cy.get('[data-testid="frameIframe"]');

const getFrameNames = () => cy.get('[data-testid="frameName"]');

const getFrameErrors = () => cy.get('[data-testid="frameError"]');

const clearCode = () => {
  typeCode(`{${selectModifier}+a}`);
  typeCode('{backspace}');
};

export const typeCode = (code: string, delay?: number) =>
  getCodeEditor().focused().type(code, { delay });

export const selectHint = (index?: number) => {
  cy.get('.CodeMirror-hints')
    .should('be.visible')
    .then(() => {
      typeCode(
        `${
          typeof index !== 'undefined' && index > 1
            ? new Array(index - 1).fill('{downarrow}').join('')
            : ''
        }{enter}`
      );
    });
};

export const formatCode = () =>
  getCodeEditor()
    .focused()
    .type(`${isMac() ? '{cmd}' : '{ctrl}'}s`);

export const selectWidthPreference = (width: Widths[number]) => {
  cy.findByRole('button', { name: 'Configure visible frames' }).click();
  cy.findByRole('checkbox', { name: `${width}` }).click();
};

export const assertTitle = (title: string) =>
  cy
    .findByRole('textbox', { name: 'Playroom Title' })
    .should('have.value', title);

export const changeTitle = (title: string) => {
  cy.findByRole('button', { name: 'Configure visible frames' }).click();
  cy.findByRole('textbox', { name: 'Title' }).type(title);
};

export const getResetButton = () => cy.findByRole('button', { name: 'Clear' });

export const togglePreviewPanel = () =>
  cy.findByRole('button', { name: 'Preview playroom' }).click();

export const gotoPreview = () => {
  togglePreviewPanel();
  cy.findByRole('link', { name: 'Open' }).then((link) => {
    cy.visit(link.prop('href'));
  });
};

export const toggleSnippets = () =>
  cy.findByRole('button', { name: /Insert snippet/i }).click();

export const filterSnippets = (search: string) => {
  cy.findByRole('combobox', { name: 'Search snippets' }).type(search);
};

export const assertSnippetsSearchFieldIsVisible = () =>
  cy.findByRole('combobox', { name: 'Search snippets' }).should('be.visible');

const getSnippets = () =>
  cy
    .findByRole('listbox', { name: 'Filtered snippets' })
    .findAllByRole('option');

export const selectSnippetByIndex = (index: number) => getSnippets().eq(index);

export const mouseOverSnippet = (index: number) =>
  // force stops cypress scrolling the panel out of the editor
  selectSnippetByIndex(index).trigger('mousemove', { force: true });

export const assertSnippetCount = (count: number) =>
  getSnippets().should('have.length', count);

export const assertFirstFrameContains = (text: string) =>
  getFrames()
    .first()
    .its('0.contentDocument.body')
    .should((frameBody) => {
      expect(frameBody.innerText).to.eq(text);
    });

export const assertFirstFrameError = (error: string) =>
  getFrameErrors()
    .first()
    .should((el) => {
      expect(el[0].innerText).to.eq(error);
    });

export const assertFirstFrameNoError = () =>
  getFrameErrors()
    .first()
    .should((el) => {
      expect(el[0].innerText).to.eq('');
    });

export const selectNextCharacters = (numCharacters: number) => {
  typeCode('{shift+rightArrow}'.repeat(numCharacters));
};

export const selectNextWords = (numWords: number) => {
  typeCode(`{shift+${navigationModifier}+rightArrow}`.repeat(numWords));
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
  const arrowDirection = numWords >= 0 ? 'rightArrow' : 'leftArrow';
  const absoluteNumWords = Math.abs(numWords);

  typeCode(
    `{${navigationModifier}+${arrowDirection}}`.repeat(absoluteNumWords)
  );
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

export const assertCodePaneLineCount = (
  lines: number,
  wait: boolean = false
) => {
  getCodeEditor().within(() =>
    cy.get('.CodeMirror-line').should('have.length', lines)
  );

  // Wait after check to ensure original focus is restored
  if (wait) {
    cy.wait(CYPRESS_DEFAULT_WAIT_TIME); // eslint-disable-line cypress/no-unnecessary-waiting
  }
};

export const assertFramesMatch = (
  frames: Widths | Array<[frameTheme: string, frameWidth: Widths[number]]>
) => {
  const formattedFrames = frames.map((frame) => {
    if (frame === 'Fit to window') {
      return frame;
    }

    return typeof frame === 'number'
      ? `${frame}px`
      : `${frame[0]} – ${frame[1]}px`;
  });

  getFrameNames()
    .should('have.length', frames.length)
    .should((frameEls) => {
      const formattedFrameNames = frameEls
        .map((_, el) => el.innerText)
        .toArray();
      return expect(formattedFrameNames).to.deep.equal(formattedFrames);
    });
};

export const assertPreviewContains = (text: string) =>
  cy
    .get('[data-testid="previewIframe"]')
    .its('0.contentDocument.body')
    .should((frameBody) => {
      expect(frameBody.innerText).to.eq(text);
    });

export const loadPlayroom = (initialCode?: string) => {
  const baseUrl = 'http://localhost:9000';
  const visitUrl = initialCode
    ? createUrl({ baseUrl, code: dedent(initialCode) })
    : baseUrl;

  return cy.visit(visitUrl).then((window) => {
    if (!initialCode) {
      clearCode();
    }

    const { storageKey } = window.__playroomConfig__;
    indexedDB.deleteDatabase(storageKey);
  });
};

const typeInSearchField = (text: string) =>
  cy.get('.CodeMirror-search-field').type(text);

export const findInCode = (term: string) => {
  // Wait necessary to ensure code pane is focussed
  cy.wait(CYPRESS_DEFAULT_WAIT_TIME); // eslint-disable-line cypress/no-unnecessary-waiting
  typeCode(`{${cmdPlus('f')}}`);

  typeInSearchField(`${term}{enter}`);
};

export const replaceInCode = (term: string, replaceWith?: string) => {
  // Wait necessary to ensure code pane is focussed
  cy.wait(CYPRESS_DEFAULT_WAIT_TIME); // eslint-disable-line cypress/no-unnecessary-waiting
  typeCode(`{${cmdPlus('alt+f')}}`);
  typeInSearchField(`${term}{enter}`);
  if (replaceWith) {
    typeInSearchField(`${replaceWith}{enter}`);
  }
};

export const jumpToLine = (line: number, character?: number) => {
  // Wait necessary to ensure code pane is focussed
  cy.wait(CYPRESS_DEFAULT_WAIT_TIME); // eslint-disable-line cypress/no-unnecessary-waiting
  typeCode(`{${cmdPlus('g')}}`);

  typeCode(character ? `${line}:${character}{enter}` : `${line}{enter}`);
};

export const assertCodePaneSearchMatchesCount = (lines: number) => {
  getCodeEditor().within(() =>
    cy.get('.cm-searching').should('have.length', lines)
  );
};

export const assertZeroStateIsVisible = () =>
  cy.findByTestId('zeroState').should('be.visible');
