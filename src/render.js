import { createRoot } from 'react-dom/client';

export const renderElement = (node, outlet) => {
  const root = createRoot(outlet);
  root.render(node);
};
