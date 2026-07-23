jest.mock('../config', () => ({
  __esModule: true,
  default: {},
}));

import { normalizeWidths } from './widths';

describe('normalize widths', () => {
  it('preserves array width configuration', () => {
    expect(normalizeWidths([320, 768])).toEqual([
      { width: 320 },
      { width: 768 },
    ]);
  });

  it('preserves names from object width configuration', () => {
    expect(normalizeWidths({ sm: 320, md: 768 })).toEqual([
      { name: 'sm', width: 320 },
      { name: 'md', width: 768 },
    ]);
  });
});
