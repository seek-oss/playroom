import {
  formatCode,
  typeCode,
  getFirstFrame,
  assertFirstFrameContains,
  assertCodePaneContains,
  assertCodePaneLineCount,
  assertFramesMatch,
  selectWidthPreferenceByIndex
} from '../support/utils';

describe('Smoke test', () => {
  it('renders to frame', () => {
    typeCode('<Foo />');
    assertFirstFrameContains('Foo');

    typeCode('<Bar />');
    assertFirstFrameContains('Bar');
  });

  it('autocompletes', () => {
    typeCode('<F{enter} c{enter}={downarrow}{enter} />');
    assertFirstFrameContains('Foo');
    assertCodePaneContains('<Foo color="blue" />');
  });

  it('formats', () => {
    cy.visit('http://localhost:9000/').reload();

    typeCode('<Foo><Foo><Bar/>');
    assertCodePaneLineCount(1);
    formatCode();
    assertCodePaneLineCount(6);
  });

  it('url handling - code (base64 encoding)', () => {
    cy.visit(
      'http://localhost:9000/#?code=PEZvbz48Rm9vPjxCYXIvPjwvRm9vPjwvRm9vPg'
    ).reload();

    assertFirstFrameContains('Foo');
    assertCodePaneContains('<Foo><Foo><Bar/></Foo></Foo>');
  });

  it('url handling - code (LZ-based compression)', () => {
    cy.visit(
      'http://localhost:9000/#?code=N4Igxg9gJgpiBcIA8AxCEB8r1YEIEMAnAei2LUyXJxAF8g'
    ).reload();

    assertFirstFrameContains('Foo');
    assertCodePaneContains('<Foo><Foo><Bar/></Foo></Foo>');
  });

  it('url handling - widths', () => {
    cy.visit(
      'http://localhost:9000/#?code=N4Ig7glgJgLgFgZxALgNoGYDsBWANJgNgA4BdAXyA'
    ).reload();

    assertFramesMatch(['375px', '768px']);
  });

  it('toolbar - filter widths', () => {
    cy.visit('http://localhost:9000/').reload();

    const frames = ['320px', '375px', '768px', '1024px'];
    const widthIndexToSelect = 1;

    assertFramesMatch(frames);
    selectWidthPreferenceByIndex(widthIndexToSelect);
    assertFramesMatch([frames[widthIndexToSelect]]);
  });

  it('toolbar - copy to clipboard', () => {
    const copySpy = cy.spy();

    cy.visit(
      'http://localhost:9000/#?code=N4Igxg9gJgpiBcIA8AxCEB8r1YEIEMAnAei2LUyXJxAF8g'
    ).reload();

    cy.document()
      .then(doc => {
        cy.stub(doc, 'execCommand', args => {
          if (args === 'copy') {
            copySpy();
            return true;
          }
        });
      })
      .get('[data-testid="copyToClipboard"]')
      .click()
      .then(() => expect(copySpy).to.have.been.called);
  });

  it('frames are interactive', () => {
    cy.visit('http://localhost:9000/').reload();

    getFirstFrame().click('center');
  });
});
