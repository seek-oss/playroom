import { style, keyframes, globalStyle } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { sharedPopupStyles } from '../../css/shared.css';
import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

const popoverPadding = 'xxsmall';
const snippetPadding = 'small';

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
      left: 0,
      right: 0,
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
    margin: 'none',
  }),
  {
    listStyle: 'none',
    height: 300,
  },
]);

export const noGroupsVerticalPadding = sprinkles({
  paddingY: popoverPadding,
});

const groupHeadingBorder = '1px';
export const group = style({});

/**
 * No styling hook for the element that middle mans the `Command.Group` component
 * and the `heading` slot, so targeting the attribute with a scoped selector.
 *
 * Isolates the sticky styles from the visual styles (`groupHeading`) to ensure
 * any change in the `cmdk-base` library doesn't impact the visuals, only the
 * sticky behaviour.
 */
globalStyle(`${group} > [cmdk-group-heading]`, {
  position: 'sticky',
  top: calc(groupHeadingBorder).negate().toString(),
  zIndex: 1,
});

export const groupHeading = style([
  sprinkles({
    paddingY: 'medium',
    paddingX: snippetPadding,
  }),
  {
    marginTop: calc(groupHeadingBorder).negate().toString(),
    background: colorPaletteVars.background.surface,
    borderTop: `${groupHeadingBorder} solid ${colorPaletteVars.border.standard}`,
    borderBottom: `${groupHeadingBorder} solid ${colorPaletteVars.border.standard}`,
  },
]);

export const groupItems = sprinkles({ paddingY: popoverPadding });
export const snippet = style([
  sprinkles({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    paddingX: snippetPadding,
  }),
  {
    color: colorPaletteVars.foreground.neutral,
    isolation: 'isolate',
    cursor: 'default',
    scrollMarginBlock: vars.space[popoverPadding],
    height: vars.buttonSizes.large,
    '::before': {
      content: '',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: vars.space[popoverPadding],
      right: vars.space[popoverPadding],
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
      [`${groupItems} > &`]: {
        scrollMarginBlockStart: calc(vars.buttonSizes.large)
          .add(calc(groupHeadingBorder).multiply(2))
          .add(calc(vars.space[popoverPadding]).multiply(2))
          .toString(),
      },
    },
  },
]);

export const name = style([
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
    paddingY: 'none',
  }),
  {
    transform: 'scale(0.97)',
    opacity: 0,
    animation: `${enterAnimation} 80ms ease-out forwards`,
  },
]);

export const popupWidth = style({
  width: 'min(400px, 90vw)',
});
