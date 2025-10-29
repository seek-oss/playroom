import dedent from 'dedent';

import type { Widths } from '../../src/configModules/widths';
import {
  assertCodePaneContains,
  assertCodePaneLineCount,
  assertCodePaneSearchMatchesCount,
  assertColourMode,
  assertFirstFrameContains,
  assertFramesMatch,
  assertSnippetsSearchFieldIsVisible,
  assertTitle,
  clearThemeSelection,
  clearWidthSelection,
  closeMainMenu,
  cmdPlus,
  editorPositionViaMenu,
  findInCode,
  formatCode,
  getCodeEditor,
  jumpToLine,
  loadPlayroom,
  loadPlayroomWithAppearance,
  loadThemedPlayroom,
  openMainMenu,
  openMainMenuSubMenu,
  replaceInCode,
  selectThemePreference,
  selectToEndOfLine,
  selectWidthPreference,
  typeCode,
} from '../support/utils';

describe('Main Menu', () => {
  it('New playroom', () => {
    loadPlayroom();
    openMainMenu();
    cy.findByRole('link', { name: 'New Playroom' }).then((link) => {
      cy.visit(link.prop('href')).then(() => {
        assertCodePaneContains('');
        typeCode('TEST');
        assertCodePaneContains('TEST');
        assertFirstFrameContains('TEST');
      });
    });
  });

  it('Open playroom', () => {
    loadPlayroom();
    openMainMenu();
    cy.findByRole('menuitem', { name: 'Open Playroom...' }).click();
    cy.findByRole('dialog', { name: 'Open Playroom' }).should('be.visible');
  });

  it('Duplicate playroom', () => {
    cy.visit(
      'http://localhost:9000/#?code=N4Igxg9gJgpiBcIA8ALAjAPgCowM4BcACAYWhiQHp0MQAaEfFGAWzwQG0BdegdwEsojXB24M%2B%2BADZxEOAoSzipIAL5A'
    );
    assertCodePaneContains('<h1>Test Code</h1>');
    openMainMenu();
    cy.findByRole('link', { name: 'Duplicate' }).then((link) => {
      cy.visit(link.prop('href'))
        .reload() // Flush the hash update through.
        .then(() => {
          assertTitle('(Copy) Test Title');
          assertCodePaneContains('<h1>Test Code</h1>');
          assertFirstFrameContains('Test Code');
        });
    });
  });

  it('Share', () => {
    // Disabled without code
    loadPlayroom();
    openMainMenu();
    cy.findByRole('menuitem', { name: 'Share' })
      .then((el) => el[0].getAttribute('aria-disabled'))
      .should('equal', 'true');
    closeMainMenu();

    // Enabled with code
    getCodeEditor().click();
    typeCode('<Foo><Foo><Bar/>');
    openMainMenu();
    cy.findByRole('menuitem', { name: 'Share' }).click();
    cy.findByRole('dialog', { name: 'Share Playroom' }).should('be.visible');
  });

  describe('Frames', () => {
    it('Widths', () => {
      const widths: Widths = [320, 375, 768, 1024, 'Fit to window'];
      const widthToSelect = widths[1];

      loadPlayroom();
      typeCode('TEST');
      assertFramesMatch(widths);
      selectWidthPreference(widthToSelect, { source: 'menu' });
      assertFramesMatch([widthToSelect]);

      clearWidthSelection({ source: 'menu' });
      assertFramesMatch(widths);
    });

    it('Themes', () => {
      const widths: Widths = [320, 375, 768, 1024, 'Fit to window'];
      const themes: string[] = ['themeOne', 'themeTwo'];

      const allFrames = widths.flatMap((width) =>
        themes.map<[string, Widths[number]]>((theme) => [theme, width])
      );

      loadThemedPlayroom();
      typeCode('TEST');
      assertFramesMatch(allFrames);

      // First selection
      selectWidthPreference(widths[3], { source: 'menu' });
      selectThemePreference(themes[1], { source: 'menu' });
      assertFramesMatch([[themes[1], widths[3]]]);

      // Second selection
      selectThemePreference(themes[1], { source: 'menu' });
      selectThemePreference(themes[0], { source: 'menu' });
      selectWidthPreference(widths[1], { source: 'menu' });
      assertFramesMatch([
        [themes[0], widths[1]],
        [themes[0], widths[3]],
      ]);

      clearWidthSelection({ source: 'menu' });
      clearThemeSelection({ source: 'menu' });
      assertFramesMatch(allFrames);
    });
  });

  describe('Editor actions', () => {
    it('Insert snippet', () => {
      loadPlayroom();
      typeCode('<div>Initial <span>code');
      openMainMenuSubMenu('Editor actions');
      cy.findByRole('menuitem', { name: 'Insert snippet' }).click();
      assertSnippetsSearchFieldIsVisible();
      assertCodePaneLineCount(8);
    });

    it('Find', () => {
      loadPlayroom(`
        <div>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);
      findInCode('div', { source: 'menu' });
      assertCodePaneSearchMatchesCount(6);
    });

    it('Find & replace', () => {
      loadPlayroom(`
        <div>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);
      replaceInCode('div', 'span', { source: 'menu' });
      cy.get('.CodeMirror-dialog button').contains('Yes').click();
      cy.get('.CodeMirror-dialog button').contains('Yes').click();
      assertCodePaneContains(dedent`
        <span>First line</span>
        <div>Second line</div>
        <div>Third line</div>
      `);
    });

    it('Tidy code', () => {
      loadPlayroom();
      typeCode('<Foo><Foo><Bar/>');
      assertCodePaneLineCount(1);
      formatCode({ source: 'keyboard' });
      assertCodePaneLineCount(6);
    });

    it('Toggle comment', () => {
      loadPlayroom(`
        <div>First line</div>
        <div>Second line</div>
        <div>Third line</div>`);
      assertCodePaneLineCount(3);
      openMainMenuSubMenu('Editor actions');
      cy.findByRole('menuitem', { name: 'Toggle comment' }).click();
      assertCodePaneContains(dedent`
        {/* <div>First line</div> */}
        <div>Second line</div>
        <div>Third line</div>
      `);
    });

    it('Wrap selection in tag', () => {
      loadPlayroom(`
        <div>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);
      assertCodePaneLineCount(3);
      selectToEndOfLine();
      openMainMenuSubMenu('Editor actions');
      cy.findByRole('menuitem', { name: 'Wrap selection in tag' }).click();
      typeCode('a');
      assertCodePaneContains(dedent`
        <a><div>First line</div></a>
        <div>Second line</div>
        <div>Third line</div>
      `);
    });

    it('Select next occurrence', () => {
      loadPlayroom(`
        <div>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);
      assertCodePaneLineCount(3);
      typeCode('{rightArrow}');
      openMainMenuSubMenu('Editor actions');
      cy.findByRole('menuitem', { name: 'Select next occurrence' }).click();
      typeCode('a');
      assertCodePaneContains(dedent`
        <a>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);
    });

    it('Jump to line number', () => {
      loadPlayroom(`
        <div>First line</div>
        <div>Second line</div>
        <div>Third line</div>
        <div>Forth line</div>
      `);
      assertCodePaneLineCount(4);
      jumpToLine(3, { source: 'menu' });
      typeCode('c');
      assertCodePaneContains(dedent`
        <div>First line</div>
        <div>Second line</div>
        c<div>Third line</div>
        <div>Forth line</div>
      `);
    });

    it('Swap line up', () => {
      loadPlayroom(`
        <div>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);
      assertCodePaneLineCount(3);
      typeCode('{downArrow}');
      openMainMenuSubMenu('Editor actions');
      cy.findByRole('menuitem', { name: 'Swap line up' }).click();
      assertCodePaneContains(dedent`
        <div>Second line</div>
        <div>First line</div>
        <div>Third line</div>
      `);
    });

    it('Swap line down', () => {
      loadPlayroom(`
        <div>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);
      assertCodePaneLineCount(3);
      openMainMenuSubMenu('Editor actions');
      cy.findByRole('menuitem', { name: 'Swap line down' }).click();
      assertCodePaneContains(dedent`
        <div>Second line</div>
        <div>First line</div>
        <div>Third line</div>
      `);
    });

    it('Duplicate line up', () => {
      loadPlayroom(`
        <div>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);
      assertCodePaneLineCount(3);
      openMainMenuSubMenu('Editor actions');
      cy.findByRole('menuitem', { name: 'Duplicate line up' }).click();
      assertCodePaneContains(dedent`
        <div>First line</div>
        <div>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);
    });

    it('Duplicate line down', () => {
      loadPlayroom(`
        <div>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);
      assertCodePaneLineCount(3);
      typeCode('{downArrow}');
      openMainMenuSubMenu('Editor actions');
      cy.findByRole('menuitem', { name: 'Duplicate line down' }).click();
      assertCodePaneContains(dedent`
        <div>First line</div>
        <div>Second line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);
    });

    it('Add cursor to previous line', () => {
      loadPlayroom(`
        <div>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);
      assertCodePaneLineCount(3);
      typeCode('{downArrow}');
      openMainMenuSubMenu('Editor actions');
      cy.findByRole('menuitem', {
        name: 'Add cursor to previous line',
      }).click();
      typeCode('x');
      assertCodePaneContains(dedent`
        x<div>First line</div>
        x<div>Second line</div>
        <div>Third line</div>
      `);
    });

    it('Add cursor to next line', () => {
      loadPlayroom(`
        <div>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);
      assertCodePaneLineCount(3);
      typeCode('{downArrow}');
      openMainMenuSubMenu('Editor actions');
      cy.findByRole('menuitem', {
        name: 'Add cursor to next line',
      }).click();
      typeCode('x');
      assertCodePaneContains(dedent`
        <div>First line</div>
        x<div>Second line</div>
        x<div>Third line</div>
      `);
    });
  });

  it('Editor position', () => {
    loadPlayroom();

    // Hide code
    editorPositionViaMenu('hidden');
    getCodeEditor().should('not.be.visible');
    cy.findByRole('button', { name: 'Show code' }).should('be.visible');

    // Show code
    editorPositionViaMenu('left');
    getCodeEditor().should('be.visible');
    cy.findByRole('button', { name: 'Hide code' }).should('be.visible');
  });

  describe('Show/Hide UI', () => {
    it('Mouse', () => {
      loadPlayroom();

      getCodeEditor().should('be.visible');
      openMainMenu();
      cy.findByRole('menuitem', { name: 'Show/Hide UI' }).click();
      getCodeEditor().should('not.be.visible');
      openMainMenu();
      cy.findByRole('menuitem', { name: 'Show/Hide UI' }).click();
      getCodeEditor().should('be.visible');
    });

    it('Keyboard', () => {
      loadPlayroom();

      getCodeEditor().should('be.visible');
      cy.get('body').type(cmdPlus('\\'));
      getCodeEditor().should('not.be.visible');
      cy.get('body').type(cmdPlus('\\'));
      getCodeEditor().should('be.visible');
    });
  });

  describe('Appearance', () => {
    it('Light', () => {
      loadPlayroomWithAppearance('dark');
      openMainMenuSubMenu('Appearance');
      cy.findByRole('menuitemradio', { name: 'Light' }).click();
      assertColourMode('light');
    });

    it('Dark', () => {
      loadPlayroomWithAppearance('light');
      openMainMenuSubMenu('Appearance');
      cy.findByRole('menuitemradio', { name: 'Dark' }).click();
      assertColourMode('dark');
    });
  });
});
