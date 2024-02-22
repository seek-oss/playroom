import {
  typeCodeWithDelay,
  assertFirstFrameContains,
  loadPlayroom,
} from '../support/utils';

describe('useScope', () => {
  beforeEach(() => {
    loadPlayroom();
  });

  it('works', () => {
    typeCodeWithDelay('{{}hello()} {{}world()}');
    assertFirstFrameContains('HELLO WORLD');
  });
});
