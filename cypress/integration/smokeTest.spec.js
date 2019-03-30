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

  it('snippets', () => {
    typeCode('{ctrl} ');
    typeCode('{downarrow}{enter}');
    assertFrameContains('Bar');
    assertTextareaContains('<div>Bar</div>');
  });
});
