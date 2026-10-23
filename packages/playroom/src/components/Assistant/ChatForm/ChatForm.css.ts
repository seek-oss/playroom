import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { textarea } from './ChatField.css';
import { colorPaletteVars, sprinkles } from '../../../css/sprinkles.css';
import { vars } from '../../../css/vars.css';

export const formPadding = 'medium';

export const form = style([
  sprinkles({
    position: 'relative',
    paddingBottom: formPadding,
  }),
  {
    borderTop: `1px solid ${colorPaletteVars.border.standard}`,
  },
]);

export const focusIndicator = style({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  outline: `2px solid ${colorPaletteVars.outline.focus}`,
  outlineOffset: calc(vars.space.xsmall).negate().toString(),
  borderRadius: vars.radii.large,
  transition: vars.transition.fast,
  pointerEvents: 'none',
  opacity: 0,
  selectors: {
    [`${textarea}:focus-visible ~ &`]: {
      opacity: 1,
    },
  },
});

export const attachmentContainer = sprinkles({
  paddingX: formPadding,
  paddingTop: 'xlarge',
});

export const actionsContainer = sprinkles({
  paddingX: formPadding,
});
