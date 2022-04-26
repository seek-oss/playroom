import { calc } from '@vanilla-extract/css-utils';
import { style } from '@vanilla-extract/css';
import { sprinkles, vars, colorPaletteVars } from '../sprinkles.css';
import { toolbarItemSize } from '../ToolbarItem/ToolbarItem.css';

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
    borderRadius: 'large',
  }),
  {
    padding: `0 ${statusGutter}`,
    left: offset,
    transform: `translateX(-${offset})`,
    top: calc(vars.grid).multiply(5).toString(),
    height: calc(vars.grid).multiply(8).toString(),
    maxWidth: calc('100vw')
      .subtract(`${toolbarItemSize}px`)
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
