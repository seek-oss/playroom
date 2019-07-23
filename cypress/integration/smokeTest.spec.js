import {
  typeCode,
  assertFrameContains,
  assertCodePaneContains
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
});
