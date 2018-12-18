import {
  typeCode,
  assertFrameContains,
  assertTextareaContains
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
    assertTextareaContains('<Foo color="blue" />');
  });
});
