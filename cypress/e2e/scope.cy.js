import {
  typeCode,
  assertFirstFrameContains,
  loadPlayroom,
} from '../support/utils';

describe('useScope', () => {
  beforeEach(() => {
    loadPlayroom();
  });

  it('works', () => {
    typeCode('{{}hello()} {{}world()}', { delay: 0 });
    assertFirstFrameContains('HELLO WORLD');
  });
});
