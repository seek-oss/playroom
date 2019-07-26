import {
  formatCode,
  typeCode,
  assertFrameContains,
  assertCodePaneContains,
  assertCodePaneLineCount
} from '../support/utils';

describe('Smoke test', () => {
  it('works', () => {
    typeCode('<Foo />');
    assertFrameContains('Foo');

    typeCode('<Bar />');
    assertFrameContains('Bar');
  });

  it('autocompletes', () => {
    typeCode('<F{enter} c{enter}={downarrow}{enter} />');
    assertFrameContains('Foo');
    assertCodePaneContains('<Foo color="blue" />');
  });

  it('formats', () => {
    cy.visit(
      'http://localhost:9000/#?code=PEZvbz48Rm9vPjxCYXIvPjwvRm9vPjwvRm9vPg'
    ).reload();
    assertCodePaneLineCount(1);
    formatCode();
    assertCodePaneLineCount(6);
  });
});
