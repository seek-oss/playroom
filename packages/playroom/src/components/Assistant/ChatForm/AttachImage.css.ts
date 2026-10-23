import { style } from '@vanilla-extract/css';

import { sprinkles } from '../../../css/sprinkles.css';

export const imageActionContainer = sprinkles({
  position: 'relative',
});

export const imageInput = style([
  sprinkles({
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    opacity: 0,
    overflow: 'hidden',
  }),
]);
