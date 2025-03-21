import dedent from 'dedent';
import {
  formatCode,
  typeCode,
  assertFirstFrameContains,
  assertCodePaneContains,
  assertCodePaneLineCount,
  loadPlayroom,
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
    typeCode('<F{enter} c{enter}={downarrow}{enter} />', 150);
    assertFirstFrameContains('Foo');
    assertCodePaneContains('<Foo color="blue" />');
  });

  it('formats', () => {
    typeCode('<Foo><Foo><Bar/>');
    assertCodePaneLineCount(1);
    formatCode();
    assertCodePaneLineCount(6);
  });

  it('formats css in a style block', () => {
    typeCode(
      '<style>{{}css`html {{} border: 1px solid red; {}}`{rightarrow}{backspace}{}}'
    );
    assertCodePaneLineCount(1);
    formatCode();
    assertCodePaneContains(dedent`
      <style>{css\`
        html {
          border: 1px solid red;
        }
      \`}</style>\n
    `);
  });
});
