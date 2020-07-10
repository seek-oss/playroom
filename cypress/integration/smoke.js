import { getFirstFrame, loadPlayroom } from '../support/utils';

describe('Smoke', () => {
  beforeEach(() => {
    loadPlayroom();
  });

  it('frames are interactive', () => {
    getFirstFrame().click('center');
  });
});
