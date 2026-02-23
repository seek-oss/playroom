import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { useRef, useState } from 'react';

import { client, model } from '../../configModules/assistantClient';

export type AssistantMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  variants: string[];
  attachment?: string;
};

interface UseOpenAIChatProps {
  instructions?: string;
  initialMessages?: AssistantMessage[];
  onUpdate?: (assistantMessage: AssistantMessage) => void;
  onFinish?: (assistantMessage: AssistantMessage) => void;
  onError?: (err: Error) => void;
}

// Only check if it starts with `{` as the end is not available until
// streaming finishes
const isMessageStructuredResponse = (str: string) => str.startsWith('{');

const parseAssistantMessage = ({
  id,
  content,
}: Pick<AssistantMessage, 'id' | 'content'>): AssistantMessage => {
  let parsedMessage = content;
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
    role: 'assistant',
    content: parsedMessage,
    variants: parsedVariants,
  };
};

type StreamingAssistantMessage = AssistantMessage & { __isStreaming?: boolean };
export function useChat({
  instructions,
  initialMessages = [],
  onUpdate,
  onFinish,
  onError,
}: UseOpenAIChatProps) {
  const [messages, setMessages] =
    useState<StreamingAssistantMessage[]>(initialMessages);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const streamControllerRef = useRef<AbortController | null>(null);

  const stop = () => {
    if (streamControllerRef.current) {
      streamControllerRef.current.abort();
      streamControllerRef.current = null;
      setLoading(false);

      // If the last message was still streaming, remove it
      // as it is only valid if the response was not interrupted
      if (messages[messages.length - 1]?.__isStreaming) {
        setMessages(messages.slice(0, -1));
      }
    }
  };

  const resetChat = () => {
    setMessages(initialMessages);
    setErrorMessage(null);
    setLoading(false);
  };

  const sendMessage = async (input: string, imageDataUrl?: string | null) => {
    if (client === false) {
      throw new Error('Assistant client is not configured');
    }
    if (model === false) {
      throw new Error('Assistant model is not provided');
    }

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
      // Build messages array: system + conversation history + current message
      const systemMessage = `${
        instructions ? `${instructions}\n\n` : ''
      }Please respond in this exact JSON format: {"message": "your response here", "variants": ["variant1", "variant2", "variant3"]}`;

      const chatMessages: ChatCompletionMessageParam[] = [
        { role: 'system', content: systemMessage },
        ...messages,
        {
          ...newMessage,
          content: imageDataUrl
            ? [
                { type: 'text', text: newMessage.content },
                {
                  type: 'image_url',
                  image_url: { url: imageDataUrl, detail: 'auto' },
                },
              ]
            : newMessage.content,
        },
      ];

      const stream = await client.chat.completions.create({
        model,
        messages: chatMessages,
        stream: true,
      });

      streamControllerRef.current = stream.controller;

      let messageId = '';
      let messageContent = '';
      let stage: 'awaitingMessage' | 'awaitingVariants' = 'awaitingMessage';
      for await (const chunk of stream) {
        if (!messageId && chunk.id) {
          messageId = chunk.id;
        }

        if (chunk.choices[0]?.delta?.content) {
          messageContent += chunk.choices[0].delta.content;
          try {
            let renderable = '';
            if (stage === 'awaitingMessage') {
              const endOfMessageIndex = messageContent.indexOf('",\n  "');
              const hasMessageCompleted = endOfMessageIndex > 0;
              const messagePart = hasMessageCompleted
                ? // Handles when end of message chunk appears in same chunk as variants beginning
                  messageContent.slice(0, endOfMessageIndex)
                : // Handles rendering as much of the message as we have received
                  messageContent;

              if (hasMessageCompleted) {
                // Move onto next stage for next chunk
                stage = 'awaitingVariants';
              }

              renderable = `${messagePart}"}`;
              JSON.parse(renderable);
            } else {
              const endOfVariantIndex = messageContent.lastIndexOf('",\n    "');

              if (endOfVariantIndex > 0) {
                renderable = `${messageContent.slice(0, endOfVariantIndex)}"]}`;
                JSON.parse(renderable);
              }
            }

            if (messageId && renderable) {
              const tempMessage: StreamingAssistantMessage =
                parseAssistantMessage({
                  id: messageId,
                  content: renderable,
                });
              // Set streaming flag to remove message if user interrupts before stream finishes
              tempMessage.__isStreaming = true;
              setMessages([...newMessages, tempMessage]);
              onUpdate?.(tempMessage);
            }
          } catch {}
        } else if (chunk.choices[0]?.finish_reason === 'stop') {
          const finalAssistantMessage = parseAssistantMessage({
            id: messageId,
            content: messageContent,
          });

          setMessages([...newMessages, finalAssistantMessage]);
          setLoading(false);
          onUpdate?.(finalAssistantMessage);
          onFinish?.(finalAssistantMessage);
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
    stop,
  };
}
