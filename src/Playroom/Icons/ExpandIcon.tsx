import React from 'react';

interface ExpandIconProps {
  size?: number;
}
export default ({ size = 24 }: ExpandIconProps) => (
  <svg
    height={size}
    viewBox="0 0 482.239 482.239"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="m0 17.223v120.56h34.446v-103.337h103.337v-34.446h-120.56c-9.52 0-17.223 7.703-17.223 17.223z" />
    <path d="m465.016 0h-120.56v34.446h103.337v103.337h34.446v-120.56c0-9.52-7.703-17.223-17.223-17.223z" />
    <path d="m447.793 447.793h-103.337v34.446h120.56c9.52 0 17.223-7.703 17.223-17.223v-120.56h-34.446z" />
    <path d="m34.446 344.456h-34.446v120.56c0 9.52 7.703 17.223 17.223 17.223h120.56v-34.446h-103.337z" />
  </svg>
);
