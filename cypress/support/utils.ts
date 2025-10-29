// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />
import dedent from 'dedent';

import type { Direction } from '../../src/components/CodeEditor/keymaps/types';
import { snippetPreviewDebounce } from '../../src/components/Snippets/snippetsPreviewDebounce';
import type { Widths } from '../../src/configModules/widths';
import { isMac } from '../../src/utils/formatting';
import { createUrl, decompressParams } from '../../utils';

const CYPRESS_DEFAULT_WAIT_TIME = 500;

const selectModifier = isMac() ? 'cmd' : 'ctrl';
const navigationModifier = isMac() ? 'alt' : 'ctrl';

export const cmdPlus = (keyCombo: string) => {
  const platformSpecificKey = isMac() ? 'cmd' : 'ctrl';
  return `{${platformSpecificKey}+${keyCombo}}`;
};

export const openMainMenu = () => {
  cy.findByRole('button', { name: 'Main menu' }).click();
  cy.findByRole('menu', { name: 'Main menu' }).should('be.visible');
};
export const closeMainMenu = () => {
  cy.findByRole('button', { name: 'Main menu' }).click();
};

export const getCodeEditor = () => cy.get('.CodeMirror-code');

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

export const formatCode = (options: {
  source: 'keyboard' | 'editorAction';
}) => {
  switch (options.source) {
    case 'keyboard': {
      getCodeEditor().focused().type(cmdPlus('s'));
      break;
    }
    case 'editorAction': {
      cy.findByRole('button', { name: 'Tidy code' }).click();
      break;
    }
    default: {
      throw new Error('No source provided');
    }
  }
};

export const openMainMenuSubMenu = (name: string) => {
  openMainMenu();
  // Clicking submenu triggers is having issues on second menu visit in Cypress only, using enter instead
  cy.findByRole('menuitem', { name }).type(`{enter}`);
  cy.findByRole('menuitem', { name }).should(
    'have.attr',
    'aria-expanded',
    'true'
  );
  cy.findByRole('menuitem', { name }).then((el) => {
    const subMenuId = el.attr('aria-controls')?.replace(/:/g, '\\:'); // escape colons for Cypress
    cy.get(`#${subMenuId}`).should('be.visible');
  });
};

export const openEditorActionsMenu = () => {
  cy.findByRole('button', { name: 'More actions' }).click();
  cy.findByRole('menu', { name: 'More actions' }).should('be.visible');
};

const toggleFramesMenuForSource = (
  source: 'menu' | 'header',
  state: 'open' | 'close'
) => {
  switch (source) {
    case 'header': {
      cy.findByRole('button', { name: 'Configure frames' }).click();
      break;
    }
    case 'menu': {
      if (state === 'open') {
        openMainMenuSubMenu('Frames');
      } else if (state === 'close') {
        closeMainMenu();
      }
      break;
    }
    default: {
      throw new Error('No source provided');
    }
  }
};

export const selectWidthPreference = (
  width: Widths[number],
  options: { source: 'menu' | 'header' }
) => {
  toggleFramesMenuForSource(options.source, 'open');
  cy.findByRole('menuitemcheckbox', { name: `${width}` }).click();
  toggleFramesMenuForSource(options.source, 'close');
};
export const selectThemePreference = (
  theme: string,
  options: { source: 'menu' | 'header' }
) => {
  toggleFramesMenuForSource(options.source, 'open');
  cy.findByRole('menuitemcheckbox', { name: theme }).click();
  toggleFramesMenuForSource(options.source, 'close');
};

export const assertTitle = (title: string) =>
  cy
    .findByRole('textbox', { name: 'Playroom Title' })
    .should('have.value', title);

export const changeTitle = (title: string) => {
  cy.findByRole('textbox', { name: 'Playroom Title' }).type(title);
};

export const clearWidthSelection = (options: { source: 'menu' | 'header' }) => {
  toggleFramesMenuForSource(options.source, 'open');
  cy.findByRole('menuitem', { name: 'Clear selected widths' }).click();
  toggleFramesMenuForSource(options.source, 'close');
};

export const clearThemeSelection = (options: { source: 'menu' | 'header' }) => {
  toggleFramesMenuForSource(options.source, 'open');
  cy.findByRole('menuitem', { name: 'Clear selected themes' }).click();
  toggleFramesMenuForSource(options.source, 'close');
};

export const gotoPreview = () => {
  cy.findByRole('link', { name: 'Launch Preview' }).then((link) => {
    cy.visit(link.prop('href'));
  });
};

export const gotoThemedPreview = (themeName: string) => {
  cy.findByRole('button', { name: 'Launch Preview' }).click();
  cy.findByRole('link', { name: themeName }).then((link) => {
    cy.visit(link.prop('href'));
  });
};

export const assertPreviewForTheme = (themeName: string) => {
  cy.location().should((loc) => {
    const resolvedParams = decompressParams(
      new URLSearchParams(loc.search).get('code')
    );
    expect(resolvedParams.theme).to.eq(themeName);
  });
};

export const editPreview = () => {
  cy.findByRole('link', { name: 'Edit in Playroom' }).then((link) => {
    cy.visit(link.prop('href'));
  });
};

export const toggleSnippets = (options: {
  source: 'editorAction' | 'keyboard';
}) => {
  switch (options.source) {
    case 'editorAction': {
      cy.findByRole('button', { name: /Insert snippet/i }).click();
      break;
    }
    case 'keyboard': {
      cy.get('body').type(cmdPlus('k'));
      break;
    }
    default: {
      throw new Error('No source provided');
    }
  }
};

export const filterSnippets = (search: string) => {
  cy.findByRole('combobox', { name: 'Search snippets' }).type(search, {
    delay: snippetPreviewDebounce,
  });
};

export const assertSnippetsSearchFieldIsVisible = () =>
  cy.findByRole('combobox', { name: 'Search snippets' }).should('be.visible');

const getSnippets = () =>
  cy
    .findByRole('listbox', { name: 'Filtered snippets' })
    .findAllByRole('option');

export const selectSnippetByIndex = (index: number) => getSnippets().eq(index);

export const mouseOverSnippet = (index: number) =>
  // Using `pointerMove` to trigger the event monitored by `cmdk` library
  // See: https://github.com/pacocoursey/cmdk/blob/d6fde235386414196bf80d9b9fa91e2cf89a72ea/cmdk/src/index.tsx#L717C7-L717C20
  selectSnippetByIndex(index).trigger('pointermove');

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
      : `${frame[0]} – ${
          frame[1] === 'Fit to window' ? frame[1] : `${frame[1]}px`
        }`;
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

const _loadPlayroom = (baseUrl: string, initialCode?: string) => {
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
export const loadPlayroom = (initialCode?: string) =>
  _loadPlayroom('http://localhost:9000', initialCode);

export const loadThemedPlayroom = (initialCode?: string) =>
  _loadPlayroom('http://localhost:9001', initialCode);

export const loadPlayroomWithAppearance = (
  appearance: 'light' | 'dark',
  initialCode?: string
) => {
  cy.window().then((win) => {
    cy.stub(win, 'matchMedia')
      .withArgs('(prefers-color-scheme: dark)')
      .returns({
        matches: appearance === 'dark',
        addEventListener: () => {},
        removeEventListener: () => {},
      });
  });
  loadPlayroom(initialCode);
};

export const typeInSearchField = (text: string) =>
  cy.get('.CodeMirror-search-field').type(text);

export const findInCode = (
  term: string,
  options: { source: 'keyboard' | 'editorAction' }
) => {
  // Wait necessary to ensure code pane is focussed
  cy.wait(CYPRESS_DEFAULT_WAIT_TIME); // eslint-disable-line cypress/no-unnecessary-waiting

  switch (options.source) {
    case 'keyboard': {
      typeCode(cmdPlus('f'));
      break;
    }
    case 'editorAction': {
      cy.findByRole('button', { name: 'Find' }).click();
      break;
    }
    default: {
      throw new Error('No source provided');
    }
  }

  typeInSearchField(`${term}{enter}`);
};

export const replaceInCode = (
  term: string,
  replaceWith: string | null,
  options: { source: 'keyboard' | 'editorAction' }
) => {
  // Wait necessary to ensure code pane is focussed
  cy.wait(CYPRESS_DEFAULT_WAIT_TIME); // eslint-disable-line cypress/no-unnecessary-waiting

  switch (options.source) {
    case 'keyboard': {
      typeCode(cmdPlus('alt+f'));
      break;
    }
    case 'editorAction': {
      openEditorActionsMenu();
      cy.findByRole('menuitem', { name: 'Find and replace' }).click();
      break;
    }
    default: {
      throw new Error('No source provided');
    }
  }

  typeInSearchField(`${term}{enter}`);
  if (replaceWith) {
    typeInSearchField(`${replaceWith}{enter}`);
  }
};

export const jumpToLine = (
  line: number,
  options: { source: 'keyboard' | 'editorAction' }
) => {
  // Wait necessary to ensure code pane is focussed
  cy.wait(CYPRESS_DEFAULT_WAIT_TIME); // eslint-disable-line cypress/no-unnecessary-waiting

  switch (options.source) {
    case 'keyboard': {
      typeCode(cmdPlus('g'));
      break;
    }
    case 'editorAction': {
      openEditorActionsMenu();
      cy.findByRole('menuitem', { name: 'Jump to line number' }).click();
      break;
    }
    default: {
      throw new Error('No source provided');
    }
  }

  typeCode(`${line}{enter}`);
};
export const jumpToCharacter = (line: number, character: number) => {
  // Wait necessary to ensure code pane is focussed
  cy.wait(CYPRESS_DEFAULT_WAIT_TIME); // eslint-disable-line cypress/no-unnecessary-waiting
  typeCode(cmdPlus('g'));
  typeCode(`${line}:${character}{enter}`);
};

export const assertCodePaneSearchMatchesCount = (lines: number) => {
  getCodeEditor().within(() =>
    cy.get('.cm-searching').should('have.length', lines)
  );
};

export const assertZeroStateIsVisible = () =>
  cy.findByTestId('zeroState').should('be.visible');

export const assertColourMode = (mode: 'dark' | 'light') => {
  cy.document().then((doc) => {
    expect(doc.documentElement.getAttribute('data-playroom-dark')).to.equal(
      mode === 'dark' ? '' : null
    );
  });
};

export const editorPositionViaMenu = (
  position: 'bottom' | 'left' | 'hidden'
) => {
  openMainMenuSubMenu('Editor Position');
  cy.findByRole('menuitemradio', {
    name: {
      bottom: 'Bottom',
      left: 'Left',
      hidden: 'Hidden',
    }[position],
  }).click();
  closeMainMenu();
};

export const assertStoredPlayrooms = (count: number) => {
  openMainMenu();
  cy.findByRole('menuitem', { name: 'Open Playroom...' }).click();
  cy.findByRole('dialog', { name: 'Open Playroom' }).should('be.visible');
  cy.findByRole('list', { name: 'Stored Playrooms' }).within(() => {
    cy.findAllByRole('listitem').should('have.length', count);
  });
  cy.get('body').type('{esc}');
};

export const openStoredPlayroomByName = (
  name: string,
  options: { source: 'keyboard' | 'menu' }
) => {
  switch (options.source) {
    case 'keyboard': {
      cy.get('body').type(cmdPlus('o'));
      break;
    }
    case 'menu': {
      openMainMenu();
      cy.findByRole('menuitem', { name: 'Open Playroom...' }).click();
      break;
    }
    default: {
      throw new Error('No source provided');
    }
  }

  cy.findByRole('dialog', { name: 'Open Playroom' }).should('be.visible');
  cy.findByRole('dialog', { name: 'Open Playroom' }).within(() => {
    cy.findByRole('button', { name: `Open "${name}"` }).click();
  });
};
