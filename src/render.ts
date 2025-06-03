import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

export const renderElement = async (node: ReactNode, outlet: HTMLElement) => {
  const root = createRoot(outlet);
  root.render(node);
};
