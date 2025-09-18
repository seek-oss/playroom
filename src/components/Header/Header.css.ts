import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import {
  minTouchableBeforePseudo,
  sharedPopupStyles,
} from '../../css/shared.css';
import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

export const root = style([
  sprinkles({
    paddingX: 'xlarge',
    paddingY: 'xsmall',
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
    gap: 'xsmall',
  }),
  {
    width: 'fit-content',
    justifySelf: 'flex-end',
  },
]);

export const menuButton = style([
  sprinkles({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: 'small',
    borderRadius: 'small',
  }),
  minTouchableBeforePseudo,
  {
    color: colorPaletteVars.foreground.neutral,
    isolation: 'isolate',
    '::after': {
      content: '',
      position: 'absolute',
      transition: vars.transition.fast,
      zIndex: -1,
      inset: calc(vars.space.xsmall).negate().toString(),
      backgroundColor: colorPaletteVars.background.selection,
      borderRadius: vars.radii.medium,
    },
    ':focus-visible': {
      outline: `2px solid ${colorPaletteVars.outline.focus}`,
      outlineOffset: 6,
    },
    selectors: {
      [`&:not(:hover, :focus-visible, [data-popup-open])::after`]: {
        opacity: 0,
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

const segmentedButtonRadius = 'medium';
const segmentedControlBorder = `1px solid ${colorPaletteVars.border.standard}`;

export const segmentedGroup = style([
  sprinkles({
    display: 'flex',
    alignItems: 'stretch',
    borderRadius: segmentedButtonRadius,
  }),
  {
    border: segmentedControlBorder,
    overflow: 'hidden',
    background: colorPaletteVars.background.floating,
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
    borderRadius: segmentedButtonRadius,
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
        backgroundColor: colorPaletteVars.background.selection,
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
  {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  sprinkles({ paddingX: 'small' }),
]);

export const segmentedIconButton = style([
  segmentedButtonBase,
  sprinkles({ paddingX: 'xsmall' }),
  {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
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
    color: colorPaletteVars.foreground.positive,
  },
]);
