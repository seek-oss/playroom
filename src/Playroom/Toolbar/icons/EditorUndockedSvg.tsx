import React, { SVGProps } from 'react';

export default (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    focusable="false"
    fill="currentColor"
    {...props}
  >
    <path d="M19 4H9a3.003 3.003 0 00-3 3v6a3.003 3.003 0 003 3h10a3.003 3.003 0 003-3V7a3.003 3.003 0 00-3-3zm1 9a1 1 0 01-1 1H9a1 1 0 01-1-1V7a1 1 0 011-1h10a1 1 0 011 1z" />
    <path d="M7 18H5a1 1 0 01-1-1V8.184A2.995 2.995 0 002 11v6a3.003 3.003 0 003 3h10a2.995 2.995 0 002.816-2H7z" />
  </svg>
);
