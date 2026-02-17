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
    paddingRight: popoverPadding, // Align close button with popover gutter
    paddingLeft: snippetPadding, // Align field text with snippet text
    gap: snippetPadding, // Space between field and close button (mirrors left padding on field)
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
    padding: 'none',
    flexGrow: 1,
    font: 'standard',
  }),
  {
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

const snippetHeight = vars.buttonSizes.large;

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

export const groupHeaderScrollPadding = style({
  scrollPaddingTop: snippetHeight,
});

export const noGroupsVerticalPadding = sprinkles({
  paddingY: popoverPadding,
});

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
  top: 0,
  zIndex: 1,
});

const groupHeadingBorder = '1px';
export const groupHeading = style([
  sprinkles({
    paddingY: 'medium',
    paddingX: snippetPadding,
    position: 'relative',
  }),
  {
    '::before': {
      content: '',
      position: 'absolute',
      inset: 0,
      background: colorPaletteVars.background.surface,
      opacity: 0.8,
      zIndex: -1,
      isolation: 'isolate',
    },
    backdropFilter: 'blur(6px)',
    borderBottom: `${groupHeadingBorder} solid ${colorPaletteVars.border.standard}`,
  },
]);

export const groupItems = style([
  sprinkles({ paddingY: popoverPadding }),
  {
    borderBottom: `${groupHeadingBorder} solid ${colorPaletteVars.border.standard}`,
  },
]);

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
    height: snippetHeight,
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
      [`${groupHeaderScrollPadding} &`]: {
        scrollMarginTop: calc(vars.space[popoverPadding])
          .add(groupHeadingBorder)
          .multiply(2)
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

export const empty = style([
  sprinkles({
    paddingY: 'large',
    paddingX: snippetPadding,
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
  width: 'min(350px, 90vw)',
});

export const tooltipTrigger = style([
  sprinkles({
    display: 'block',
  }),
  { minWidth: 0 },
]);
