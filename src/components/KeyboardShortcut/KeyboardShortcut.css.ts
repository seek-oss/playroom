import { style } from '@vanilla-extract/css';

export const shortcut = style({
  display: 'inline-grid',
  gridAutoFlow: 'column',
  gridAutoColumns: '1fr',
  alignItems: 'baseline',
  justifyItems: 'center',
  isolation: 'isolate',
  whiteSpace: 'nowrap',
  '@media': {
    'screen and (max-width: 767px)': {
      display: 'none',
    },
  },
});
