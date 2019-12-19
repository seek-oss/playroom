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
    <path d="M3 5a1 1 0 00-1 1v12a1 1 0 002 0V6a1 1 0 00-1-1zm18 0a1 1 0 00-1 1v12a1 1 0 002 0V6a1 1 0 00-1-1zm-2.077 6.618a.999.999 0 00-.217-.326l-1.999-1.999a1 1 0 00-1.414 1.414l.293.293H8.414l.293-.293a1 1 0 00-1.414-1.414l-2 2a1 1 0 000 1.414l2 2a1 1 0 001.414-1.414L8.414 13h7.172l-.293.293a1 1 0 101.414 1.414l1.999-1.999a1.003 1.003 0 00.217-1.09z" />
  </svg>
);
