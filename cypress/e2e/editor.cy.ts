import dedent from 'dedent';

import {
  formatCode,
  typeCode,
  assertFirstFrameContains,
  assertCodePaneContains,
  assertCodePaneLineCount,
  loadPlayroom,
  selectHint,
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

  it('formats', () => {
    typeCode('<Foo><Foo><Bar/>');
    assertCodePaneLineCount(1);
    formatCode();
    assertCodePaneLineCount(6);
  });

  it('formats css in a style block', () => {
    typeCode(
      '<style jsx>{{}`html {{} border: 1px solid red; {}}{rightarrow}{}}'
    );
    assertCodePaneLineCount(1);
    formatCode();
    assertCodePaneContains(dedent`
      <style jsx>{\`
        html {
          border: 1px solid red;
        }
      \`}</style>\n
    `);
  });
});
