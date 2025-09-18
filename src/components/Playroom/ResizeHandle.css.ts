import { style, styleVariants } from '@vanilla-extract/css';

import { colorPaletteVars, sprinkles } from '../../css/sprinkles.css';

const thickness = 6;
const length = 38;
const size = 2;

const backgroundTransition = 'background-color 100ms ease';
const borderTransition = 'border-color 100ms ease';
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
        transform: 'translateY(-50%)',
        transition: backgroundTransition,
      },
      selectors: {
        [`&${resizing}::before`]: {
          background: colorPaletteVars.background.accent,
        },
        [`&:not(${resizing}):hover::before`]: {
          background: colorPaletteVars.background.accentLight,
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
          background: colorPaletteVars.background.accentLight,
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
    background: colorPaletteVars.background.surface,
    border: `1px solid ${colorPaletteVars.border.standard}`,
    selectors: {
      [`${resizing} &`]: {
        background: colorPaletteVars.background.accent,
        borderColor: colorPaletteVars.background.accent,
      },
      [`:is(${resizeContainer.horizontal}, ${resizeContainer.vertical}):not(${resizing}):hover &`]:
        {
          background: colorPaletteVars.background.accentLight,
          borderColor: colorPaletteVars.background.accentLight,
          transitionDelay: hoverTransitionDelay,
        },
    },
    transition: `${backgroundTransition}, ${borderTransition}`,
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
