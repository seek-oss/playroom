import type { Widths } from '../../src/configModules/widths';
import {
  assertCodePaneContains,
  assertColourMode,
  assertFirstFrameContains,
  assertFramesMatch,
  assertTitle,
  clearThemeSelection,
  clearWidthSelection,
  closeMainMenu,
  cmdPlus,
  editorPositionViaMenu,
  getCodeEditor,
  loadPlayroom,
  loadPlayroomWithAppearance,
  loadThemedPlayroom,
  openMainMenu,
  openMainMenuSubMenu,
  selectThemePreference,
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

  describe('Editor position', () => {
    it('Hidden', () => {
      loadPlayroom();
      editorPositionViaMenu('hidden');
      getCodeEditor().should('not.be.visible');
      cy.findByRole('button', { name: 'Show code' }).should('be.visible');
    });

    it('Left', () => {
      loadPlayroom();
      editorPositionViaMenu('left');
      getCodeEditor().should('be.visible');
      cy.findByRole('button', { name: 'Hide code' }).should('be.visible');
    });
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
