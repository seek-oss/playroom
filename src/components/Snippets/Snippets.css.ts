import { style, keyframes } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { sharedPopupStyles } from '../../css/shared.css';
import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

const popoverPadding = 'xxsmall';
const snippetPadding = 'xsmall';

export const root = sprinkles({
  position: 'relative',
  userSelect: 'none',
});

export const fieldContainer = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
  }),
  {
    position: 'relative',
    '::after': {
      content: '',
      position: 'absolute',
      left: calc(vars.space[popoverPadding]).negate().toString(),
      right: calc(vars.space[popoverPadding]).negate().toString(),
      bottom: 0,
      height: 1,
      backgroundColor: colorPaletteVars.border.standard,
    },
  },
]);

export const searchField = style([
  sprinkles({
    border: 0,
    flexGrow: 1,
    font: 'standard',
  }),
  {
    paddingInline: vars.space[snippetPadding],
    color: colorPaletteVars.foreground.neutral,
    height: vars.touchableSize,
    background: 'transparent',
    boxShadow: 'none',
    selectors: {
      '&::-webkit-search-cancel-button': {
        WebkitAppearance: 'none',
      },
      '&::-webkit-search-decoration': {
        WebkitAppearance: 'none',
      },
      '&::-ms-clear': {
        display: 'none',
      },
      '&::-ms-reveal': {
        display: 'none',
      },
    },
    ':focus-visible': {
      outline: 'none',
      boxShadow: 'none',
    },
    '::placeholder': {
      color: colorPaletteVars.foreground.secondary,
    },
  },
]);

export const snippetsContainer = style([
  sprinkles({
    overflow: 'auto',
    paddingX: 'none',
    paddingY: popoverPadding,
    margin: 'none',
  }),
  {
    listStyle: 'none',
    height: 300,
  },
]);

export const snippet = style([
  sprinkles({
    position: 'relative',
    display: 'block',
    paddingX: snippetPadding,
    paddingY: 'small',
  }),
  {
    color: colorPaletteVars.foreground.neutral,
    isolation: 'isolate',
    cursor: 'default',
    scrollMarginBlock: vars.space[popoverPadding],
    '::before': {
      content: '',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colorPaletteVars.background.selection,
      borderRadius: vars.radii.small,
      opacity: 0,
      pointerEvents: 'none',
      zIndex: -1,
    },
    selectors: {
      '&[data-selected="true"]': {
        color: colorPaletteVars.foreground.accent,
      },
      '&[data-selected="true"]::before': {
        opacity: 1,
      },
    },
  },
]);

export const groupName = style([
  sprinkles({
    paddingRight: 'xsmall',
  }),
]);

const enterAnimation = keyframes({
  to: { opacity: 1, transform: 'scale(1)' },
});

export const popup = style([
  sharedPopupStyles,
  sprinkles({
    borderRadius: 'medium',
    paddingX: popoverPadding,
    paddingY: 'none',
  }),
  {
    transform: 'scale(0.97)',
    opacity: 0,
    animation: `${enterAnimation} 80ms ease-out forwards`,
  },
]);

export const popupWidth = style({
  width: 'min(300px, 90vw)',
});
