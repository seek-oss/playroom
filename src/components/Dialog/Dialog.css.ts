import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { comma } from '../../css/delimiters';

import { sharedPopupStyles } from '../../css/shared.css';
import { colorPaletteVars, sprinkles } from '../../css/sprinkles.css';
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

const dialogPadding = 'xlarge';
export const popup = style([
  sharedPopupStyles,
  sprinkles({
    position: 'fixed',
    overflow: 'auto',
    padding: dialogPadding,
    borderRadius: 'large',
    transition: 'fast',
    userSelect: 'none',
  }),
  {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: 1,
    maxWidth: calc('100dvw')
      .subtract(calc(vars.space.small).multiply(2))
      .toString(),
    maxHeight: calc('100dvh')
      .subtract(calc(vars.space.small).multiply(2))
      .toString(),
    selectors: {
      [comma('&[data-starting-style]', '&[data-ending-style]')]: {
        transform: 'translate(-50%, -50%) scale(0.98)',
        opacity: 0,
      },
    },
  },
]);

export const titleContainer = style([
  sprinkles({
    display: 'block',
    paddingRight: 'xxlarge', // Reserve space for absolutely positioned close button
  }),
]);

export const titleOutline = style([
  sprinkles({
    borderRadius: 'small',
    userSelect: 'none',
  }),
  {
    ':focus-visible': {
      outline: `2px solid ${colorPaletteVars.outline.focus}`,
      outlineOffset: 2,
    },
  },
]);

export const closeContainer = style([
  sprinkles({
    position: 'absolute',
    top: 0,
    right: 0,
    padding: dialogPadding,
  }),
]);
