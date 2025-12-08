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
  onUpdate?: (assistantMessage: AssistantMessage) => void;
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

  if (parsedMessage.startsWith('```json')) {
    parsedMessage = parsedMessage.replace(/^```json/, '').trim();
  }
  if (parsedMessage.endsWith('```')) {
    parsedMessage = parsedMessage.replace(/```$/, '').trim();
  }

  if (parsedMessage && isMessageStructuredResponse(parsedMessage)) {
    const parsedContent = JSON.parse(parsedMessage);

    parsedMessage = parsedContent.message;
    parsedVariants = parsedContent.variants || [];
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
  onUpdate,
  onFinish,
  onError,
}: UseOpenAIChatProps) {
  const [messages, setMessages] = useState<AssistantMessage[]>(initialMessages);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetChat = () => {
    setMessages(initialMessages);
    setErrorMessage(null);
    setLoading(false);
  };

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
        stream: true,
      });

      let messageMeta: ResponseOutputMessage | null = null;
      let messageContent = '';
      let stage: 'awaitingMessage' | 'awaitingVariants' = 'awaitingMessage';
      for await (const event of data) {
        switch (event.type) {
          case 'response.output_item.added': {
            messageMeta = event.item;
            break;
          }
          case 'response.output_text.delta': {
            messageContent += event.delta;
            try {
              let renderable = '';
              if (stage === 'awaitingMessage') {
                const endOfMessageIndex = messageContent.indexOf('",\n  "');
                const hasMessageCompleted = endOfMessageIndex > 0;
                const messagePart = hasMessageCompleted
                  ? // Handles when end of message chunk appears in same chunk as variants beginning
                    messageContent.slice(0, endOfMessageIndex)
                  : // Handles rendering as much of the message as we have receieved
                    messageContent;

                if (hasMessageCompleted) {
                  // Move onto next stage for next chunk
                  stage = 'awaitingVariants';
                }

                renderable = `${messagePart}"}`;
                JSON.parse(renderable);
              } else {
                const endOfVariantIndex =
                  messageContent.lastIndexOf('",\n    "');

                if (endOfVariantIndex > 0) {
                  renderable = `${messageContent.slice(
                    0,
                    endOfVariantIndex
                  )}"]}`;
                  JSON.parse(renderable);
                }
              }

              if (messageMeta && renderable) {
                const assistantMessage = parseAssistantMessage({
                  ...messageMeta,
                  content: [
                    {
                      type: 'output_text',
                      text: renderable,
                      annotations: [],
                    },
                  ],
                });
                setMessages([...newMessages, assistantMessage]);
                onUpdate?.(assistantMessage);
              }
            } catch {}
            break;
          }
          case 'response.output_item.done': {
            const assistantMessage = parseAssistantMessage({
              ...event.item,
              id: messageMeta?.id || event.item.id,
            });
            setMessages([...newMessages, assistantMessage]);
            setLoading(false);
            onUpdate?.(assistantMessage);
            onFinish?.(assistantMessage);
            break;
          }
        }
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
    resetChat,
    sendMessage,
    loading,
    errorMessage,
  };
}
