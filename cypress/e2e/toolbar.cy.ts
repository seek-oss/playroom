import {
  assertFramesMatch,
  assertPreviewContains,
  typeCode,
  gotoPreview,
  loadPlayroom,
  selectWidthPreference,
} from '../support/utils';

describe('Toolbar', () => {
  beforeEach(() => {
    loadPlayroom();
  });

  it('filter widths', () => {
    const frames = ['320px', '375px', '768px', '1024px'];
    const widthIndexToSelect = 1;

    assertFramesMatch(frames);

    const widthSizeToSelectAsNumber = parseInt(
      frames[widthIndexToSelect].replace('px', ''),
      10
    );

    selectWidthPreference(widthSizeToSelectAsNumber);
    assertFramesMatch([frames[widthIndexToSelect]]);
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