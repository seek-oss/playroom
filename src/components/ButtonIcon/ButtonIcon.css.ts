import { createVar, style, styleVariants } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import {
  minTouchableBeforePseudo,
  sharedPopupStyles,
} from '../../css/shared.css';
import { colorPaletteVars, sprinkles } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

const sizeVar = createVar();
export const button = style([
  sprinkles({
    boxSizing: 'border-box',
    margin: 'none',
    padding: 'none',
    userSelect: 'none',
    font: 'small',
    borderRadius: 'small',
    border: 0,
    appearance: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'medium',
    position: 'relative',
    transition: 'fast',
    zIndex: 0,
  }),
  minTouchableBeforePseudo,
  {
    background: 'transparent',
    outline: 'none',
    color: colorPaletteVars.foreground.neutral,
    height: sizeVar,
    width: sizeVar,
    '::after': {
      content: '',
      position: 'absolute',
      inset: calc(vars.space.xsmall).negate().toString(),
      transition: vars.transition.fast,
      backgroundColor: colorPaletteVars.background.neutral,
      borderRadius: vars.radii.full,
      zIndex: -1,
    },
    selectors: {
      [`&:not(:hover, :focus-visible, [data-popup-open])::after`]: {
        opacity: 0,
        transform: 'scale(.5)',
      },
      ['&:active']: {
        transform: 'scale(.9)',
      },
      [`&:focus-visible::after`]: {
        outline: `2px solid ${colorPaletteVars.outline.focus}`,
      },
    },
  },
]);

export const size = styleVariants({
  small: {
    vars: {
      [sizeVar]: '20px',
    },
  },
  medium: {
    vars: {
      [sizeVar]: '24px',
    },
  },
  large: {
    vars: {
      [sizeVar]: '32px',
    },
  },
});

export const postioner = sprinkles({
  zIndex: 'popup',
});

export const popup = sharedPopupStyles('small');
