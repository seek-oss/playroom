import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

const outlet = document.createElement('div');
document.body.appendChild(outlet);

export const renderElement = async (node: ReactNode) => {
  const root = createRoot(outlet);
  root.render(node);
};
