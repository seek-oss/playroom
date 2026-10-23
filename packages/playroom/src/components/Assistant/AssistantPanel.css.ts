import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { colorPaletteVars, sprinkles } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

export const root = style([
  sprinkles({
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
  }),
  {
    background: colorPaletteVars.background.surface,
  },
]);

const panelGutter = 'medium';

export const titleContainer = sprinkles({
  padding: panelGutter,
  paddingTop: 'large',
  paddingBottom: 'xlarge',
});

export const assistantActions = style({
  height: vars.buttonSizes.small,
});

const messagesEndBufferSize = 'large';
export const messageContainer = style([
  sprinkles({
    paddingX: panelGutter,
    paddingBottom: messagesEndBufferSize,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    gap: 'xlarge',
  }),
  {
    minHeight: calc('100%')
      .subtract(vars.space[messagesEndBufferSize])
      .toString(),
  },
]);
