import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

const padding = 'xxsmall';

export const root = style([
  sprinkles({
    display: 'inline',
    borderRadius: 'small',
    padding,
  }),
  {
    background: 'transparent',
    border: 'none',
    marginBlock: calc(vars.space[padding]).negate().toString(),
    marginRight: calc(vars.space[padding]).negate().toString(),
    selectors: {
      '&:hover': {
        backgroundColor: colorPaletteVars.background.selection,
      },
    },
  },
]);
