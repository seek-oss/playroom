import { style } from '@vanilla-extract/css';

import { sprinkles } from '../../../css/sprinkles.css';

export const imageAttachment = style([
  sprinkles({
    position: 'relative',
  }),
  {
    width: 'fit-content',
  },
]);

export const attachmentImage = style([
  sprinkles({
    display: 'block',
    borderRadius: 'medium',
  }),
  {
    objectFit: 'contain',
  },
]);

export const size = {
  small: style({
    maxHeight: '70px',
    maxWidth: 'auto',
  }),
  standard: style({
    maxHeight: '200px',
    maxWidth: '100%',
  }),
};

export const removeContainer = style([
  sprinkles({
    position: 'absolute',
    top: 0,
    right: 0,
  }),
  { transform: 'translate(50%, -50%)' },
]);
