import { typeCode, assertFrameContains } from '../support/utils';

describe('Smoke test', () => {
  it('works', () => {
    typeCode('<Foo />');
    assertFrameContains('Foo');

    typeCode('<Bar />');
    assertFrameContains('Bar');
  });
});
