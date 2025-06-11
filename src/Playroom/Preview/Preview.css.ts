import { style } from '@vanilla-extract/css';

import { sprinkles } from '../sprinkles.css';

export const renderContainer = sprinkles({
  position: 'relative',
  zIndex: 0,
});

export const splashScreenContainer = style([
  {
    /**
     * Attempt to elevate above portal'd elements that are
     * attached to the `body` element.
     */
    zIndex: 99999,
  },
  sprinkles({
    position: 'relative',
  }),
]);
