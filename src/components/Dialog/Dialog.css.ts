import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { comma } from '../../css/delimiters';

import { sharedPopupStyles } from '../../css/shared.css';
import { sprinkles } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

export const backdrop = style([
  sprinkles({
    position: 'fixed',
    inset: 0,
    transition: 'fast',
  }),
  {
    backgroundColor: 'black',
    opacity: 0.2,
    selectors: {
      [`html[data-playroom-dark] &`]: {
        opacity: 0.7,
      },
      [comma('&[data-starting-style]', '&[data-ending-style]')]: {
        opacity: 0,
      },
    },
  },
]);

export const popup = style([
  sharedPopupStyles('large'),
  sprinkles({
    position: 'fixed',
    overflow: 'auto',
  }),
  {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: calc('100dvw')
      .subtract(calc(vars.space.small).multiply(2))
      .toString(),
    maxHeight: calc('100dvh')
      .subtract(calc(vars.space.small).multiply(2))
      .toString(),
    selectors: {
      [comma('&[data-starting-style]', '&[data-ending-style]')]: {
        transform: 'translate(-50%, -50%) scale(0.9)',
      },
    },
  },
]);
