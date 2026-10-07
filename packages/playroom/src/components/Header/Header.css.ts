import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { comma } from '../../css/delimiters';

import { minTouchableBeforePseudo } from '../../css/shared.css';
import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

export const headerPaddingX = 'medium';
export const headerPaddingY = 'xsmall';

export const root = style([
  sprinkles({
    paddingX: headerPaddingX,
    paddingY: headerPaddingY,
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

export const actionsGap = 'xsmall';

export const actionsContainer = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    gap: actionsGap,
    transition: 'fast',
  }),
  {
    width: 'fit-content',
    justifySelf: 'flex-end',
    '@media': {
      ['screen and (max-width: 767px)']: {
        display: 'none',
      },
    },
  },
]);

export const shareActionsReady = style({});
export const shareActions = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    gap: actionsGap,
    transition: 'fast',
  }),
  {
    selectors: {
      [`&:not(${shareActionsReady})`]: {
        opacity: 0,
        transform: `translateX(${vars.space[actionsGap]})`,
        pointerEvents: 'none',
      },
    },
  },
]);

export const menuButton = style([
  sprinkles({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: 'small',
    borderRadius: 'small',
    border: 0,
    padding: 'none',
  }),
  minTouchableBeforePseudo,
  {
    background: 'transparent',
    color: colorPaletteVars.background.secondaryAccent,
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

export const dialogScrollContentGutter = 'small';
export const openDialogContent = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
  }),
  {
    margin: calc(vars.space[dialogScrollContentGutter]).negate().toString(),
    height: '60vh',
    maxHeight: '700px',
    width: '60vw',
    maxWidth: '75vw',
  },
]);

const segmentedButtonRadius = 'medium';
const segmentedButtonBorderWidth = '1px';
const segmentedControlBorder = `${segmentedButtonBorderWidth} solid ${colorPaletteVars.border.standard}`;

export const segmentedGroup = style([
  sprinkles({
    display: 'flex',
    alignItems: 'stretch',
  }),
]);

const segmentedButtonBase = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingY: 'xsmall',
    transition: 'fast',
    borderRadius: segmentedButtonRadius,
    userSelect: 'none',
  }),
  minTouchableBeforePseudo,
  {
    appearance: 'none',
    outline: 'none',
    background: colorPaletteVars.background.surface,
    color: colorPaletteVars.foreground.neutral,
    border: segmentedControlBorder,
    height: vars.buttonSizes.medium,
    selectors: {
      [comma('&:hover', '&[data-popup-open]')]: {
        backgroundColor: colorPaletteVars.background.selection,
      },
      ['&:focus-visible']: {
        outline: `2px solid ${colorPaletteVars.outline.focus}`,
        zIndex: 1,
      },
    },
  },
]);

export const segmentedTextButton = style([
  segmentedButtonBase,
  {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    marginRight: `-${segmentedButtonBorderWidth}`,
  },
  sprinkles({ paddingX: 'small' }),
]);

export const segmentedIconButton = style([
  segmentedButtonBase,
  sprinkles({ paddingX: 'xsmall' }),
  {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
]);

export const copyLinkSuccess = style([
  {
    color: colorPaletteVars.foreground.positive,
  },
]);

export const separator = style([
  sprinkles({
    width: 'full',
    border: 0,
  }),
  {
    height: 1,
    backgroundColor: colorPaletteVars.border.standard,
  },
]);
