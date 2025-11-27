import { AssistantProvider } from './AssistantContext';
import { AssistantPanel } from './AssistantPanel';

export const Assistant = () => (
  <AssistantProvider>
    <AssistantPanel />
  </AssistantProvider>
);
