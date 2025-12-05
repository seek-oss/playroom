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

type ActiveSuggestion = {
  messageId: string;
  suggestionIndex: number;
} | null;
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
  applySuggestion: (suggestedCode: string) => void;
  activeSuggestion: ActiveSuggestion;
  previewSuggestion: (params: {
    id: string;
    code: string;
    suggestionIndex: number;
  }) => void;
  resetActiveSuggestion: () => void;
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
  const [activeSuggestion, setActiveSuggestion] =
    useState<ActiveSuggestion>(null);

  const resetActiveSuggestion = () => {
    setActiveSuggestion(null);
  };

  const applySuggestion: AssistantContextValue['applySuggestion'] = (
    suggestion
  ) => {
    resetActiveSuggestion();
    dispatch({
      type: 'persistSuggestion',
      payload: {
        code: suggestion,
      },
    });
  };

  const previewSuggestion: AssistantContextValue['previewSuggestion'] = ({
    id,
    code,
    suggestionIndex,
  }) => {
    setActiveSuggestion({
      messageId: id,
      suggestionIndex,
    });
    dispatch({
      type: 'previewSuggestion',
      payload: { code },
    });
  };

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

  const { messages, setMessages, sendMessage, loading, errorMessage } = useChat(
    {
      instructions,
      initialMessages,
      onUpdate: ({ id, role, variants }) => {
        if (role === 'assistant' && variants.length > 0) {
          previewSuggestion({ id, code: variants[0], suggestionIndex: 0 });
        }
      },
    }
  );

  const reset = () => {
    setMessages(initialMessages);
    setImageDataUrl(null);
  };

  return (
    <AssistantContext.Provider
      value={{
        messages,
        handleSubmit: (input) => {
          setActiveSuggestion(null);
          sendMessage(input, imageDataUrl);
        },
        attachCode,
        setAttachCode,
        errorMessage,
        reset,
        loading,
        imageDataUrl,
        setImageDataUrl,
        applySuggestion,
        activeSuggestion,
        previewSuggestion,
        resetActiveSuggestion,
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
