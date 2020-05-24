import React from 'react';

interface TickIconProps {
  size?: number;
}
export default ({ size = 24 }: TickIconProps) => (
  <svg
    viewBox="0 0 24 24"
    focusable="false"
    fill="currentColor"
    width={size}
    height={size}
    role="img"
  >
    <path d="M19.7 6.3c-.4-.4-1-.4-1.4 0L9 15.6l-3.3-3.3c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l4 4c.2.2.4.3.7.3s.5-.1.7-.3l10-10c.4-.4.4-1 0-1.4z" />
  </svg>
);
