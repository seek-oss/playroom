import React from 'react';

interface Props {
  size?: number;
}

export default ({ size = 24 }: Props) => (
  <svg
    viewBox="0 0 24 24"
    focusable="false"
    fill="currentColor"
    width={size}
    height={size}
  >
    <circle
      cx="18"
      cy="6"
      r="2"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeMiterlimit="10"
    />
    <circle
      cx="6"
      cy="12"
      r="2"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeMiterlimit="10"
    />
    <circle
      cx="18"
      cy="18"
      r="2"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeMiterlimit="10"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      d="M8 13l8 4m0-10l-8 4"
    />
  </svg>
);
