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
  openEditorActionsMenu,
  replaceInCode,
  selectToEndOfLine,
  jumpToLine,
  cmdPlus,
} from '../support/utils';

describe('Editor', () => {
  it('renders to frame', () => {
    loadPlayroom();
    typeCode('<Foo />');
    assertFirstFrameContains('Foo');

    typeCode('<Bar />');
    assertFirstFrameContains('Foo\nBar');
  });

  it('autocompletes', () => {
    loadPlayroom();
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
    loadPlayroom();
    typeCode('<Foo><Foo><Bar/>');
    assertCodePaneLineCount(1);
    formatCode({ source: 'keyboard' });
    assertCodePaneLineCount(6);
    typeCode(cmdPlus('z')); // Undo
    assertCodePaneLineCount(1);
    typeCode(cmdPlus('shift+z')); // Redo
    assertCodePaneLineCount(6);
  });

  it('formats css in a style block', () => {
    loadPlayroom();
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
    loadPlayroom();
    // Hide code
    cy.findByRole('button', { name: 'Hide code' }).click();
    getCodeEditor().should('not.be.visible');
    cy.findByRole('button', { name: 'Show code' }).should('have.focus');

    // Show code
    cy.findByRole('button', { name: 'Show code' }).click();
    getCodeEditor().should('be.visible');
    cy.findByRole('button', { name: 'Hide code' }).should('have.focus');
  });

  describe('Editor actions', () => {
    it('Find & replace', () => {
      loadPlayroom(`
        <div>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);
      replaceInCode('div', 'span', { source: 'editorAction' });
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
      formatCode({ source: 'editorAction' });
      assertCodePaneLineCount(6);
    });

    it('Toggle comment', () => {
      loadPlayroom(`
        <div>First line</div>
        <div>Second line</div>
        <div>Third line</div>`);
      assertCodePaneLineCount(3);
      openEditorActionsMenu();
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
      openEditorActionsMenu();
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
      openEditorActionsMenu();
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
      jumpToLine(3, { source: 'editorAction' });
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
      openEditorActionsMenu();
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
      openEditorActionsMenu();
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
      openEditorActionsMenu();
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
      openEditorActionsMenu();
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
      openEditorActionsMenu();
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
      openEditorActionsMenu();
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
});
