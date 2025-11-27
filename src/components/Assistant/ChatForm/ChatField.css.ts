import { style } from '@vanilla-extract/css';

import { formPadding } from './ChatForm.css';
import { colorPaletteVars, sprinkles } from '../../../css/sprinkles.css';

export const textarea = style([
  sprinkles({
    font: 'large',
    width: 'full',
    paddingX: 'large',
    paddingY: formPadding,
    boxSizing: 'border-box',
    borderRadius: 'medium',
  }),
  {
    resize: 'none',
    outline: 'none',
    border: 'none',
    color: colorPaletteVars.foreground.neutral,
    background: colorPaletteVars.background.surface,
    '::placeholder': {
      color: colorPaletteVars.foreground.secondary,
    },
  },
]);
