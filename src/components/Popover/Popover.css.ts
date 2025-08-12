import { style } from '@vanilla-extract/css';

import { sharedPopupStyles } from '../../css/shared.css';

export const positioner = style({
  zIndex: 1,
});

export const popup = sharedPopupStyles('large');
