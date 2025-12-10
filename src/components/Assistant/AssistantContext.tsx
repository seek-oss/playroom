import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useContext,
  useState,
  type ReactNode,
} from 'react';

import { StoreContext } from '../../contexts/StoreContext';

import { systemPrompt } from './AssistantPrompt';
import { useChat, type AssistantMessage } from './useChat';

export type AssistantContextValue = {
  messages: AssistantMessage[];
  reset: () => void;
  errorMessage?: string | null;
  handleSubmit: (input: string) => void;
  loading: boolean;
  attachCode: boolean;
  setAttachCode: Dispatch<SetStateAction<boolean>>;
  imageDataUrl: string | null;
  setImageDataUrl: Dispatch<SetStateAction<string | null>>;
  stop: () => void;
};

export const AssistantContext = createContext<AssistantContextValue | null>(
  null
);

interface Props {
  children: ReactNode;
}
export const AssistantProvider = ({ children }: Props) => {
  const [state, dispatch] = useContext(StoreContext);
  const [attachCode, setAttachCode] = useState(true);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);

  const instructions = `${systemPrompt}${
    attachCode && state.code
      ? `\n\nCurrent code to modify is as follows:\`\`\`\n${state.code}\n\`\`\``
      : ''
  }`;

  const initialMessages = [
    {
      id: self.crypto.randomUUID(),
      role: 'assistant' as const,
      content:
        attachCode && state.code
          ? 'What changes would you like to make?'
          : "Describe what you'd like to build!",
      variants: [],
    },
  ];

  const { messages, resetChat, sendMessage, loading, errorMessage, stop } =
    useChat({
      instructions,
      initialMessages,
    });

  const reset = () => {
    dispatch({ type: 'clearSuggestion' });
    resetChat();
    setImageDataUrl(null);
  };

  return (
    <AssistantContext.Provider
      value={{
        messages,
        handleSubmit: (input) => {
          sendMessage(input, imageDataUrl);
        },
        attachCode,
        setAttachCode,
        errorMessage,
        reset,
        loading,
        imageDataUrl,
        setImageDataUrl,
        stop,
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
};

export const useAssistant = () => {
  const context = useContext(AssistantContext);

  if (!context) {
    throw new Error('Must be used inside of a Assistant Context');
  }

  return context;
};
