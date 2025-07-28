import { style, styleVariants } from '@vanilla-extract/css';

import { colorPaletteVars, sprinkles } from '../../css/sprinkles.css';

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

export const resizeContainer = styleVariants({
  horizontal: [
    resizeCursor.horizontal,
    containerCommon,
    sprinkles({
      width: 'full',
      paddingTop: 'xxsmall',
    }),
  ],
  vertical: [
    resizeCursor.vertical,
    containerCommon,
    sprinkles({
      height: 'full',
      paddingX: 'xxsmall',
    }),
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
