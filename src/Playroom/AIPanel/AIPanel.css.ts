import { style } from '@vanilla-extract/css';
import { sprinkles, colorPaletteVars } from '../sprinkles.css';
import { vars } from '../vars.css';

export const field = style({
  width: '100%',
});

export const input = style([
  sprinkles({
    display: 'block',
    width: 'full',
    padding: 'small',
    borderRadius: 'small',
  }),
  {
    backgroundColor: colorPaletteVars.background.surface,
    border: `1px solid ${colorPaletteVars.foreground.neutral}`,
    fontFamily: 'inherit',
    fontSize: '0.9em',
  },
]);

export const textarea = style([
  input,
  {
    resize: 'vertical',
    minHeight: '100px',
  },
]);

export const aiOutput = style([
  sprinkles({
    padding: 'medium',
    borderRadius: 'small',
  }),
  {
    backgroundColor: colorPaletteVars.background.selection,
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
  },
]);

export const status = style([
  sprinkles({
    padding: 'xsmall',
  }),
]);

export const outputCode = style({
  fontFamily: 'monospace',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'break-word',
});

export const conversationContainer = style([
  sprinkles({
    borderRadius: 'small',
    padding: 'medium',
  }),
  {
    backgroundColor: colorPaletteVars.background.surface,
    border: `1px solid ${colorPaletteVars.border.standard}`,
    maxHeight: '200px',
    overflowY: 'auto',
  },
]);

export const messageContainer = style([
  sprinkles({
    padding: 'small',
    marginBottom: 'small',
    borderRadius: 'small',
  }),
]);

export const userMessage = style({
  backgroundColor: colorPaletteVars.background.neutral,
});

export const assistantMessage = style({
  backgroundColor: colorPaletteVars.background.positive,
});

export const textField = style([
  sprinkles({
    font: 'large',
    width: 'full',
    paddingX: 'large',
    boxSizing: 'border-box',
    borderRadius: 'medium',
  }),
  {
    color: colorPaletteVars.foreground.neutral,
    height: vars.touchableSize,
    background: colorPaletteVars.background.surface,
    '::placeholder': {
      color: colorPaletteVars.foreground.neutralSoft,
    },
    border: `1px solid ${colorPaletteVars.border.standard}`,
    minHeight: 100,
  },
]);

export const textArea = style([
  sprinkles({
    font: 'large',
    width: 'full',
    paddingX: 'large',
    boxSizing: 'border-box',
    borderRadius: 'medium',
  }),
  {
    padding: 10,
    color: colorPaletteVars.foreground.neutral,
    height: 100,
    background: colorPaletteVars.background.surface,
    '::placeholder': {
      color: colorPaletteVars.foreground.neutralSoft,
    },
    border: `1px solid ${colorPaletteVars.border.standard}`,
  },
]);
