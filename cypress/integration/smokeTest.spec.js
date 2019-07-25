import {
  typeCode,
  assertFrameContains,
  assertCodePaneContains,
  assertCodePaneLineCount,
  formatCode
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
    typeCode('<Foo><Foo><Bar />');
    assertCodePaneLineCount(1);
    formatCode();
    assertCodePaneLineCount(6);
  });
});
