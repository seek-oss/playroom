import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

const statusGutter = '15px';
const icon = '16px';

export const dismissable = style({});
export const show = style({});
export const positive = style({});
export const critical = style({});

const offset = '50%';
export const status = style([
  sprinkles({
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    transition: 'fast',
    borderRadius: 'medium',
  }),
  {
    padding: `0 ${statusGutter}`,
    left: offset,
    transform: `translateX(-${offset})`,
    top: vars.space.large,
    height: vars.space.xlarge,
    maxWidth: calc('100dvw')
      .subtract(calc(vars.codeGutterSize).multiply(2))
      .toString(),
    selectors: {
      [`&${dismissable}`]: {
        paddingRight: calc(statusGutter).multiply(2).add(icon).toString(),
      },
      [`&:not(${show})`]: {
        opacity: 0,
        pointerEvents: 'none',
        transform: `translate3d(-${offset}, -10px, 0)`,
      },
      [`&${positive}`]: {
        backgroundColor: colorPaletteVars.background.positive,
      },
      [`&${critical}`]: {
        backgroundColor: colorPaletteVars.background.critical,
      },
    },
  },
]);

export const dismiss = style([
  sprinkles({
    display: 'flex',
    position: 'absolute',
    cursor: 'pointer',
    transition: 'fast',
  }),
  {
    paddingLeft: statusGutter,
    right: statusGutter,
    height: icon,
    width: icon,
    selectors: {
      [`&:not(:hover)`]: {
        opacity: 0.4,
      },
    },
  },
]);
