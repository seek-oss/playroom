import { style } from '@vanilla-extract/css';

import { comma } from '../../css/delimiters';

import {
  minTouchableBeforePseudo,
  sharedPopupStyles,
} from '../../css/shared.css';
import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';

export const root = style([
  sprinkles({
    paddingX: 'xlarge',
    paddingY: 'small',
  }),
  {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colorPaletteVars.background.surface,
  },
]);

export const menuContainer = style({
  width: 'fit-content',
});

export const actionsContainer = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    gap: 'large',
  }),
  {
    width: 'fit-content',
    justifySelf: 'flex-end',
  },
]);

export const menuButton = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    gap: 'small',
  }),
  {
    color: colorPaletteVars.foreground.neutral,
    selectors: {
      [comma(
        '*:hover > &',
        '*:active > &',
        '*:focus-visible > &',
        '*[data-popup-open] > &'
      )]: {
        color: colorPaletteVars.foreground.accent,
      },
    },
  },
]);

export const openDialogContent = style([
  sprinkles({
    overflow: 'auto',
  }),
  {
    height: '60vh',
    maxHeight: '700px',
    width: '60vw',
    maxWidth: '75vw',
  },
]);

const segmentedControlBorder = `1px solid ${colorPaletteVars.border.standard}`;

export const segmentedGroup = style([
  sprinkles({
    display: 'flex',
    alignItems: 'stretch',
    borderRadius: 'medium',
  }),
  {
    border: segmentedControlBorder,
    overflow: 'hidden',
    background: 'transparent',
  },
]);

const segmentedButtonBase = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingY: 'xsmall',
    cursor: 'pointer',
    transition: 'fast',
  }),
  minTouchableBeforePseudo,
  {
    appearance: 'none',
    background: 'transparent',
    border: 0,
    outline: 'none',
    color: colorPaletteVars.foreground.neutral,
    selectors: {
      ['&:hover']: {
        backgroundColor: colorPaletteVars.background.neutral,
      },
      ['&:focus-visible']: {
        outline: `2px solid ${colorPaletteVars.outline.focus}`,
        outlineOffset: -2,
      },
    },
  },
]);

export const segmentedTextButton = style([
  segmentedButtonBase,
  sprinkles({ paddingX: 'small' }),
]);

export const segmentedIconButton = style([
  segmentedButtonBase,
  sprinkles({ paddingX: 'xsmall' }),
  {
    borderLeft: segmentedControlBorder,
  },
]);

export const sharePopup = sharedPopupStyles('small');

export const copyLinkContainer = style({
  position: 'relative',
});

export const copyLinkTextHidden = style({
  opacity: 0,
  userSelect: 'none',
});

export const copyLinkSuccess = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  {
    position: 'absolute',
    inset: 0,
  },
]);
