import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import './css/fonts.css';

const outlet = document.createElement('div');
document.body.appendChild(outlet);

export const renderElement = async (node: ReactNode) => {
  const root = createRoot(outlet);
  root.render(node);
};
