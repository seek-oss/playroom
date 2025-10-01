import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

const verticalPadding = 'xsmall';
const horizontalPadding = 'xxsmall';

export const root = style([
  sprinkles({
    display: 'inline',
    borderRadius: 'small',
    paddingY: verticalPadding,
    paddingX: verticalPadding,
  }),
  {
    background: 'transparent',
    border: 'none',
    marginBlock: calc(vars.space[verticalPadding]).negate().toString(),
    marginRight: calc(vars.space[horizontalPadding]).negate().toString(),
    selectors: {
      '&:hover': {
        backgroundColor: colorPaletteVars.background.selection,
      },
    },
  },
]);
