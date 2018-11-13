import React from 'react';

const NewWindowSvg = props => (
  <svg viewBox="0 0 16 20" {...props}>
    <path d="M12 13H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1zM2 11h9V2H2v9zm13 5H4a1 1 0 0 1-1-1v-1h11V3h1a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1z" />
    <text
      y={31}
      fontSize={5}
      fontWeight="bold"
      fontFamily="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
    >
      {'Created by \u2726 Shmidt Sergey \u2726'}
    </text>
    <text
      y={36}
      fontSize={5}
      fontWeight="bold"
      fontFamily="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
    >
      {'from the Noun Project'}
    </text>
  </svg>
);

export default NewWindowSvg;
