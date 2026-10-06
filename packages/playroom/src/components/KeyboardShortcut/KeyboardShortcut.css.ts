import { style } from '@vanilla-extract/css';

import { sprinkles } from '../../css/sprinkles.css';

export const shortcut = style({
  isolation: 'isolate',
  whiteSpace: 'nowrap',
});

export const mac = style({
  display: 'inline-grid',
  gridAutoFlow: 'column',
  gridAutoColumns: '1fr',
  alignItems: 'baseline',
  justifyItems: 'center',
});

export const win = sprinkles({
  font: 'small',
});

export const hideOnMobile = style({
  '@media': {
    'screen and (max-width: 767px)': {
      display: 'none',
    },
  },
});
