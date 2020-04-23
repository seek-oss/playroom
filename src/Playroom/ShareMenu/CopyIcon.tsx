import React from 'react';

interface CopyIconProps {
  size?: number;
}
export const CopyIcon = ({ size = 24 }: CopyIconProps) => (
  <svg
    viewBox="0 0 24 24"
    focusable="false"
    fill="currentColor"
    width={size}
    height={size}
    role="img"
  >
    <path d="M14 7H6c-1.7 0-3 1.3-3 3v8c0 1.7 1.3 3 3 3h8c1.7 0 3-1.3 3-3v-8c0-1.7-1.3-3-3-3zm1 11c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-8c0-.6.4-1 1-1h8c.6 0 1 .4 1 1v8z" />
    <path d="M19 2h-8C9.3 2 8 3.3 8 5h2c0-.6.4-1 1-1h8c.6 0 1 .4 1 1v8c0 .6-.4 1-1 1v2c1.7 0 3-1.3 3-3V5c0-1.7-1.3-3-3-3z" />
  </svg>
);
