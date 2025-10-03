import { style, styleVariants } from '@vanilla-extract/css';

import { colorPaletteVars, sprinkles } from '../../css/sprinkles.css';

const thickness = 8;
const length = 38;
const size = 1;

const backgroundTransition = 'background-color 100ms ease';
const borderTransition = 'outline-color 100ms ease';
const hoverTransitionDelay = '200ms';

// Separate style applied to the container AND the body during resize.
export const resizeCursor = styleVariants({
  horizontal: {
    cursor: 'row-resize',
  },
  vertical: {
    cursor: 'col-resize',
  },
});

const containerCommon = sprinkles({
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1,
});

export const resizing = style({});

export const resizeContainer = styleVariants({
  horizontal: [
    resizeCursor.horizontal,
    containerCommon,
    sprinkles({
      width: 'full',
    }),
    {
      transform: 'translateY(-50%)',
      zIndex: 2,
      '::before': {
        content: '',
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        height: size,
        transform: `translateY(${size * -1}px)`,
        transition: backgroundTransition,
      },
      selectors: {
        [`&${resizing}::before`]: {
          background: colorPaletteVars.background.accent,
        },
        [`&:not(${resizing}):hover::before`]: {
          background: colorPaletteVars.background.accent,
          transitionDelay: hoverTransitionDelay,
        },
      },
    },
  ],
  vertical: [
    resizeCursor.vertical,
    containerCommon,
    sprinkles({
      height: 'full',
    }),
    {
      right: 0,
      transform: 'translateX(50%)',
      zIndex: 2,
      '::before': {
        content: '',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: '50%',
        width: size,
        transform: 'translateX(-50%)',
        transition: backgroundTransition,
      },
      selectors: {
        [`&${resizing}::before`]: {
          background: colorPaletteVars.background.accent,
        },
        [`&:not(${resizing}):hover::before`]: {
          background: colorPaletteVars.background.accent,
          transitionDelay: hoverTransitionDelay,
        },
      },
    },
  ],
});

export const right = sprinkles({ right: 0 });
export const left = sprinkles({ left: 0 });

const handleCommon = style([
  sprinkles({
    borderRadius: 'large',
    pointerEvents: 'none',
    position: 'relative',
    zIndex: 1,
  }),
  {
    background: colorPaletteVars.background.floating,
    outline: `1px solid ${colorPaletteVars.border.standard}`,
    outlineOffset: -1,
    // Place ::after: on top of opaque background,
    // to allow using transparent background when resizing
    '::after': {
      content: '',
      position: 'absolute',
      inset: 0,
      borderRadius: 'inherit',
      transition: backgroundTransition,
    },
    selectors: {
      [`${resizing} &`]: {
        outlineColor: colorPaletteVars.background.accent,
      },
      [`${resizing} &::after`]: {
        background: colorPaletteVars.background.accent,
      },
      [`:is(${resizeContainer.horizontal}, ${resizeContainer.vertical}):not(${resizing}):hover &`]:
        {
          outlineColor: colorPaletteVars.background.accent,
          transitionDelay: hoverTransitionDelay,
        },
      [`:is(${resizeContainer.horizontal}, ${resizeContainer.vertical}):not(${resizing}):hover &::after`]:
        {
          transitionDelay: hoverTransitionDelay,
        },
    },
    transition: borderTransition,
  },
]);

export const handle = styleVariants({
  horizontal: [
    handleCommon,
    {
      width: length,
      height: thickness,
    },
  ],
  vertical: [
    handleCommon,
    {
      width: thickness,
      height: length,
    },
  ],
});
