import type { Widths } from '../../src/configModules/widths';
import {
  assertFramesMatch,
  assertPreviewContains,
  typeCode,
  gotoPreview,
  loadPlayroom,
  clearWidthSelection,
  selectWidthPreference,
  changeTitle,
  assertZeroStateIsVisible,
  loadThemedPlayroom,
  selectThemePreference,
  clearThemeSelection,
  gotoThemedPreview,
  editPreview,
  assertPreviewForTheme,
  getFrames,
} from '../support/utils';

describe('Header actions', () => {
  it('filter widths', () => {
    const widths: Widths = [320, 375, 768, 1024, 'Fit to window'];
    const widthToSelect = widths[1];

    loadPlayroom();
    assertZeroStateIsVisible();
    typeCode('TEST');
    assertFramesMatch(widths);
    selectWidthPreference(widthToSelect, { source: 'header' });
    assertFramesMatch([widthToSelect]);

    clearWidthSelection({ source: 'header' });
    assertFramesMatch(widths);
  });

  it('filter themes', () => {
    const widths: Widths = [320, 375, 768, 1024, 'Fit to window'];
    const themes: string[] = ['themeOne', 'themeTwo'];

    const allFrames = widths.flatMap((width) =>
      themes.map<[string, Widths[number]]>((theme) => [theme, width])
    );

    loadThemedPlayroom();
    assertZeroStateIsVisible();
    typeCode('TEST');
    assertFramesMatch(allFrames);
    // First selection
    selectWidthPreference(widths[3], { source: 'header' });
    selectThemePreference(themes[1], { source: 'header' });
    assertFramesMatch([[themes[1], widths[3]]]);

    // Second selection
    selectThemePreference(themes[1], { source: 'header' });
    selectThemePreference(themes[0], { source: 'header' });
    selectWidthPreference(widths[1], { source: 'header' });
    assertFramesMatch([
      [themes[0], widths[1]],
      [themes[0], widths[3]],
    ]);

    clearWidthSelection({ source: 'header' });
    clearThemeSelection({ source: 'header' });
    assertFramesMatch(allFrames);
  });

  it('change title', () => {
    loadPlayroom();
    assertZeroStateIsVisible();
    changeTitle('Test');
    cy.title().should('eq', 'Test | Playroom');
    getFrames().first().should('be.visible');
  });

  it('preview', () => {
    loadPlayroom();
    typeCode('<Foo><Foo><Bar/>');

    gotoPreview();

    assertPreviewContains('Foo\nFoo\nBar');
  });

  it('preview (themed)', () => {
    loadThemedPlayroom();
    typeCode('<Foo><Foo><Bar/>');

    gotoThemedPreview('themeTwo');
    assertPreviewContains('Foo\nFoo\nBar');
    assertPreviewForTheme('themeTwo');

    editPreview();

    gotoThemedPreview('themeOne');
    assertPreviewContains('Foo\nFoo\nBar');
    assertPreviewForTheme('themeOne');
  });

  it('copy to clipboard', () => {
    const url =
      'http://localhost:9000/#?code=N4Igxg9gJgpiBcIA8AxCEB8r1YEIEMAnAei2LUyXJxAF8g';

    cy.visit(url);

    cy.findByRole('button', { name: 'Copy link' }).click();
    cy.window()
      .its('navigator.clipboard')
      .then((clip) => clip.readText())
      .should('equal', url);
  });

  it('share', () => {
    loadPlayroom();
    typeCode('<Foo><Foo><Bar/>');

    cy.findByRole('button', { name: 'Share' }).click();
    cy.findByRole('dialog', { name: 'Share Playroom' }).should('be.visible');
    cy.get('body').type('{esc}');
  });
});
