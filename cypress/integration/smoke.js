import { getFirstFrame } from '../support/utils';

describe('Smoke', () => {
  it('frames are interactive', () => {
    getFirstFrame().click('center');
  });
});
