import dedent from 'dedent';

import {
  typeCode,
  assertFirstFrameContains,
  assertCodePaneContains,
  assertCodePaneLineCount,
  loadPlayroom,
  selectHint,
  getCodeEditor,
  formatCode,
} from '../support/utils';

describe('Editor', () => {
  beforeEach(() => {
    loadPlayroom();
  });

  it('renders to frame', () => {
    typeCode('<Foo />');
    assertFirstFrameContains('Foo');

    typeCode('<Bar />');
    assertFirstFrameContains('Foo\nBar');
  });

  it('autocompletes', () => {
    typeCode('<F');
    selectHint();
    typeCode(' c');
    selectHint();
    typeCode('=');
    selectHint(2);
    typeCode(' />');
    assertFirstFrameContains('Foo');
    assertCodePaneContains('<Foo color="blue" />');
  });

  it('formats with keyboard shortcut', () => {
    typeCode('<Foo><Foo><Bar/>');
    assertCodePaneLineCount(1);
    formatCode({ source: 'keyboard' });
    assertCodePaneLineCount(6);
  });

  it('formats with editor action', () => {
    typeCode('<Foo><Foo><Bar/>');
    assertCodePaneLineCount(1);
    formatCode({ source: 'editorAction' });
    assertCodePaneLineCount(6);
  });

  it('formats css in a style block', () => {
    typeCode(
      '<style jsx>{{}`html {{} border: 1px solid red; {}}{rightarrow}{}}'
    );
    assertCodePaneLineCount(1);
    formatCode({ source: 'keyboard' });
    assertCodePaneContains(dedent`
      <style jsx>{\`
        html {
          border: 1px solid red;
        }
      \`}</style>\n
    `);
  });

  it('editor visibility', () => {
    // Hide code
    cy.findByRole('button', { name: 'Hide code' }).click();
    getCodeEditor().should('not.be.visible');
    cy.findByRole('button', { name: 'Show code' }).should('have.focus');

    // Show code
    cy.findByRole('button', { name: 'Show code' }).click();
    getCodeEditor().should('be.visible');
    cy.findByRole('button', { name: 'Hide code' }).should('have.focus');
  });
});
