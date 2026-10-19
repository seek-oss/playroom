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
  }),
  {
    backdropFilter: 'blur(6px)',
    '::before': {
      content: '',
      position: 'absolute',
      inset: 0,
      backgroundColor: colorPaletteVars.background.body,
      opacity: 0.4,
    },
    selectors: {
      [`html[data-playroom-dark] &::before`]: {
        opacity: 0.7,
      },
      [comma('&[data-starting-style]::before', '&[data-ending-style]::before')]:
        {
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
    display: 'flex',
    inset: 0,
  }),
  {
    alignSelf: 'center',
    justifySelf: 'center',
    maxWidth: calc('100dvw')
      .subtract(calc(vars.space.small).multiply(2))
      .toString(),
    maxHeight: calc('100dvh')
      .subtract(calc(vars.space.small).multiply(2))
      .toString(),
    selectors: {
      [comma('&[data-starting-style]', '&[data-ending-style]')]: {
        transform: 'scale(0.98)',
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
