import { style } from '@vanilla-extract/css';

import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

export const root = style([
  sprinkles({
    position: 'fixed',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  }),
]);

export const rootEmbedded = style({
  border: `1px solid ${colorPaletteVars.border.standard}`,
  borderRadius: vars.radii.medium,
});

export const header = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'small',
  }),
  {
    borderBottom: `1px solid ${colorPaletteVars.border.standard}`,
    gap: 12,
  },
]);

export const footer = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'small',
  }),
  {
    borderTop: `1px solid ${colorPaletteVars.border.standard}`,
    gap: 12,
  },
]);

export const leftGroup = sprinkles({
  display: 'flex',
  alignItems: 'center',
  gap: 'small',
});

export const actions = sprinkles({
  display: 'flex',
  alignItems: 'center',
  gap: 'medium',
});

export const frameContainer = style([
  sprinkles({
    position: 'relative',
  }),
  { flex: 1 },
]);

export const iframe = sprinkles({
  width: 'full',
  height: 'full',
  border: 0,
});
