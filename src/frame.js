import React from 'react';
import { render } from 'react-dom';
import Frame from './Playroom/Frame';

const outlet = document.createElement('div');
document.body.appendChild(outlet);

render(<Frame />, outlet);
