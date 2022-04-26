import { style } from '@vanilla-extract/css';
import { sprinkles } from '../sprinkles.css';

export const root = style([
  sprinkles({
    height: 'full',
    width: 'full',
    whiteSpace: 'nowrap',
    display: 'flex',
    boxSizing: 'border-box',
    paddingY: 'gutter',
    paddingLeft: 'gutter',
    textAlign: 'center',
  }),
  {
    overflowX: 'auto',
    overflowY: 'hidden',
    // // Simulate centering when fewer frames than viewport width.
    '::before': {
      content: '""',
      flex: 1,
    },
    '::after': {
      content: '""',
      flex: 1,
    },
  },
]);

export const frameContainer = style([
  sprinkles({
    position: 'relative',
    height: 'full',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    paddingRight: 'gutter',
  }),
  {},
]);

export const frame = style([
  sprinkles({ position: 'relative', height: 'full', border: 0 }),
  {
    flexGrow: 1,
  },
]);

export const frameBorder = style([
  sprinkles({
    position: 'absolute',
    inset: 0,
    boxShadow: 'small',
    transition: 'medium',
    pointerEvents: 'none',
  }),
  {
    selectors: {
      [`&:not(:hover)`]: {
        opacity: 0.8,
      },
    },
  },
]);

const frameNameHeight = '30px';
export const frameName = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    transition: 'medium',
  }),
  {
    flex: `0 0 ${frameNameHeight}`,
    height: frameNameHeight,
    marginBottom: '-10px',
    selectors: {
      [`${frameContainer}:not(:hover) &`]: {
        opacity: 0.3,
      },
    },
  },
]);
