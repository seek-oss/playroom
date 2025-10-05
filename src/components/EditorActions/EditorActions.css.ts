import { style } from '@vanilla-extract/css';

import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

export const root = style([
  sprinkles({
    display: 'flex',
    gap: 'xxsmall',
    padding: 'xxsmall',
    borderRadius: 'medium',
    boxShadow: 'small',
    transition: 'fast',
  }),
  {
    backgroundColor: colorPaletteVars.background.floating,
    outline: `1px solid ${colorPaletteVars.border.standard}`,
  },
]);

export const hidden = style([
  sprinkles({ opacity: 0, pointerEvents: 'none' }),
  {
    transform: `translateY(${vars.space.xxsmall})`,
  },
]);

export const syntaxErrorsContainer = style([
  sprinkles({
    paddingX: 'xsmall',
    paddingY: 'xxsmall',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  }),
  {
    height: vars.buttonSizes.medium,
  },
]);

export const button = style([
  sprinkles({
    paddingX: 'xsmall',
    paddingY: 'xxsmall',
    borderRadius: 'small',
    display: 'flex',
    alignItems: 'center',
    gap: 'xsmall',
    border: 0,
    userSelect: 'none',
    boxSizing: 'border-box',
    appearance: 'none',
  }),
  {
    background: 'transparent',
    height: vars.buttonSizes.medium,
    color: colorPaletteVars.foreground.neutral,
    ':hover': {
      backgroundColor: colorPaletteVars.background.selection,
    },
    ':focus-visible': {
      outline: `2px solid ${colorPaletteVars.outline.focus}`,
      outlineOffset: 2,
    },
  },
]);

export const snippetsPopupWidth = style({
  width: 'min(300px, 90vw)',
});
