import { style } from '@vanilla-extract/css';

import { colorPaletteVars, type Sprinkles, sprinkles } from './sprinkles.css';
import { vars } from './vars.css';

type Size = 'small' | 'medium' | 'large';
const popupSize: Record<Size, Sprinkles> = {
  small: {
    padding: 'xsmall',
    borderRadius: 'medium',
    boxShadow: 'small',
  },
  medium: {
    padding: 'medium',
    borderRadius: 'large',
    boxShadow: 'small',
  },
  large: {
    padding: 'xlarge',
    borderRadius: 'large',
    boxShadow: 'small',
  },
};

export const sharedPopupStyles = (size: Size) =>
  style([
    sprinkles({
      boxSizing: 'border-box',
      ...popupSize[size],
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
