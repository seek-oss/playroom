import type { Widths } from '../../src/configModules/widths';
import {
  assertFramesMatch,
  assertPreviewContains,
  typeCode,
  gotoPreview,
  loadPlayroom,
  getResetButton,
  selectWidthPreference,
  changeTitle,
} from '../support/utils';

describe('Toolbar', () => {
  beforeEach(() => {
    loadPlayroom();
  });

  it('filter widths', () => {
    const frames: Widths = [320, 375, 768, 1024, 'Fit to window'];
    const widthIndexToSelect = 1;

    assertFramesMatch(frames);
    selectWidthPreference(frames[widthIndexToSelect]);
    assertFramesMatch([frames[widthIndexToSelect]]);

    getResetButton().click();
    assertFramesMatch(frames);
  });

  it('change title', () => {
    changeTitle('Test');
    cy.title().should('eq', 'Test | Playroom');
  });

  it('preview', () => {
    typeCode('<Foo><Foo><Bar/>');

    gotoPreview();

    assertPreviewContains('Foo\nFoo\nBar');
  });

  it('copy to clipboard', () => {
    const copySpy = cy.spy();

    cy.visit(
      'http://localhost:9000/#?code=N4Igxg9gJgpiBcIA8AxCEB8r1YEIEMAnAei2LUyXJxAF8g'
    );

    cy.document()
      .then((doc) => {
        cy.stub(doc, 'execCommand', (args) => {
          if (args === 'copy') {
            copySpy();
            return true;
          }
        });
      })
      .findByRole('button', { name: /Copy Playroom link/i })
      .click();

    cy.then(() => expect(copySpy).to.have.been.called);
  });
});
