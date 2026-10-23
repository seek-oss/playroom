import { style } from '@vanilla-extract/css';

import { colorPaletteVars, sprinkles } from './sprinkles.css';
import { vars } from './vars.css';

export const sharedPopupStyles = style([
  sprinkles({
    boxSizing: 'border-box',
    boxShadow: 'small',
  }),
  {
    backgroundColor: colorPaletteVars.background.floating,
    transformOrigin: 'var(--transform-origin)',
    outline: `1px solid ${colorPaletteVars.border.standard}`,
  },
]);

export const minTouchableBeforePseudo = style({
  '::before': {
    content: '',
    position: 'absolute',
    minHeight: vars.touchableSize,
    minWidth: vars.touchableSize,
    transform: 'translate(-50%, -50%)',
    left: '50%',
    top: '50%',
    width: '100%',
    height: '100%',
  },
});
