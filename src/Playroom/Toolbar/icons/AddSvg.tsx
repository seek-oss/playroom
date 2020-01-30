import React, { SVGProps } from 'react';

export default (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M18,11H13V6a1,1,0,0,0-2,0v5H6a1,1,0,0,0,0,2h5v5a1,1,0,0,0,2,0V13h5a1,1,0,0,0,0-2Z" />
  </svg>
);
