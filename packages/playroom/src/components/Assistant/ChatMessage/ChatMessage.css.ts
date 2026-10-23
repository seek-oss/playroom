import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { colorPaletteVars, sprinkles } from '../../../css/sprinkles.css';
import { vars } from '../../../css/vars.css';

export const message = style([
  sprinkles({
    borderRadius: 'large',
  }),
  {
    width: 'fit-content',
    whiteSpace: 'pre-line',
  },
]);

const messageOffset = 'xxlarge';

export const assistantMessage = style([
  sprinkles({
    marginRight: messageOffset,
  }),
  {
    alignSelf: 'flex-start',
  },
]);

export const userMessage = style([
  sprinkles({
    padding: 'medium',
    marginLeft: messageOffset,
  }),
  {
    backgroundColor: colorPaletteVars.background.selection,
    borderBottomRightRadius: 0,
    alignSelf: 'flex-end',
  },
]);

export const userMessageBlock = style({
  marginTop: calc(vars.space.xlarge)
    .add(vars.space.xxsmall)
    .negate()
    .toString(),
  borderTopRightRadius: 0,
});

export const readMessage = style({
  verticalAlign: 'middle',
  display: 'inline-flex',
  alignItems: 'center',
  marginTop: -4,
  height: '10px', // standard text cap height
});
