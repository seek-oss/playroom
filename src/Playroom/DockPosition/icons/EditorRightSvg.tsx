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
    <path d="M19,4H5A3.00328,3.00328,0,0,0,2,7V17a3.00328,3.00328,0,0,0,3,3H19a3.00328,3.00328,0,0,0,3-3V7A3.00328,3.00328,0,0,0,19,4ZM5,18a1.00067,1.00067,0,0,1-1-1V7A1.00067,1.00067,0,0,1,5,6H16V18Z" />
  </svg>
);
