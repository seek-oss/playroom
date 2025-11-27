import { zodTextFormat } from 'openai/helpers/zod';
import type {
  EasyInputMessage,
  ResponseCreateParamsNonStreaming,
  ResponseOutputMessage,
} from 'openai/resources/responses/responses';
import { useState } from 'react';
import { z } from 'zod';

import { client, model } from '../../configModules/assistantClient';

export type AssistantMessage = {
  id: string;
  role: EasyInputMessage['role'];
  content: string;
  variants: string[];
  attachment?: string;
};

interface UseOpenAIChatProps {
  instructions?: ResponseCreateParamsNonStreaming['instructions'];
  initialMessages?: AssistantMessage[];
  onFinish?: (assistantMessage: AssistantMessage) => void;
  onError?: (err: Error) => void;
}

const AssistantMessageSchema = z.object({
  message: z.string(),
  variants: z.array(z.string()),
});

// Only check if it starts with `{` as the end is not available until
// streaming finishes
const isMessageStructuredResponse = (str: string) => str.startsWith('{');

const parseAssistantMessage = ({
  id,
  role,
  content,
  type,
}: ResponseOutputMessage): AssistantMessage => {
  let parsedMessage =
    type === 'message' && content[0].type === 'output_text'
      ? content[0].text
      : '';
  let parsedVariants: string[] = [];

  if (parsedMessage && isMessageStructuredResponse(parsedMessage)) {
    const parsedContent = JSON.parse(parsedMessage);

    parsedMessage = parsedContent.message;
    parsedVariants = parsedContent.variants;
  }

  return {
    id,
    role,
    content: parsedMessage,
    variants: parsedVariants,
  };
};

export function useChat({
  instructions,
  initialMessages = [],
  onFinish,
  onError,
}: UseOpenAIChatProps) {
  const [messages, setMessages] = useState<AssistantMessage[]>(initialMessages);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sendMessage = async (input: string, imageDataUrl?: string | null) => {
    const newMessage = {
      id: self.crypto.randomUUID(),
      role: 'user' as const,
      content: input,
      variants: [],
    };
    const newMessages = [
      ...messages,
      { ...newMessage, ...(imageDataUrl ? { attachment: imageDataUrl } : {}) },
    ];
    setMessages(newMessages);
    setLoading(true);
    setErrorMessage(null);

    try {
      const data = await client.responses.create({
        model,
        instructions,
        input: [
          ...messages,
          imageDataUrl
            ? {
                ...newMessage,
                content: [
                  { type: 'input_text', text: input } as const,
                  {
                    type: 'input_image',
                    image_url: imageDataUrl,
                    detail: 'auto',
                  } as const,
                ],
              }
            : newMessage,
        ],
        text: {
          format: zodTextFormat(
            AssistantMessageSchema,
            'playroom_assistant_message'
          ),
        },
      });

      const response = data.output?.[0];
      if (response && response.type === 'message') {
        const assistantMessage = parseAssistantMessage(response);
        setMessages([...newMessages, assistantMessage]);
        setLoading(false);
        onFinish?.(assistantMessage);
      } else {
        throw new Error('No assistant message returned');
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'An error occurred while generating UI';
      setErrorMessage(errorMsg);
      setLoading(false);
      onError?.(err instanceof Error ? err : new Error('Unknown error'));
    }
  };

  return {
    messages,
    setMessages,
    sendMessage,
    loading,
    errorMessage,
  };
}
