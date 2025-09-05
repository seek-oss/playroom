import { style, styleVariants } from '@vanilla-extract/css';

import { colorPaletteVars, sprinkles } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

const thickness = 4;
const length = 70;

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
      paddingTop: 'xxsmall',
    }),
    {
      '::before': {
        content: '',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: colorPaletteVars.background.accent,
        transition: vars.transition.medium,
      },
      selectors: {
        [`&:not(${resizing})::before`]: {
          opacity: 0,
          transform: 'scaleX(0.8)',
        },
      },
    },
  ],
  vertical: [
    resizeCursor.vertical,
    containerCommon,
    sprinkles({
      height: 'full',
      paddingX: 'xxsmall',
    }),
    {
      '::before': {
        content: '',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        width: 2,
        background: colorPaletteVars.background.accent,
        transition: vars.transition.medium,
      },
      selectors: {
        [`&:not(${resizing})::before`]: {
          opacity: 0,
          transform: 'scaleY(0.8)',
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
  }),
  {
    background: colorPaletteVars.background.neutral,
    selectors: {
      [`${resizing} &`]: {
        background: colorPaletteVars.background.accent,
      },
    },
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
