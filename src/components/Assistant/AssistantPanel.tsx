import { Sparkles, SquarePen } from 'lucide-react';
import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useContext,
} from 'react';

import { StoreContext } from '../../contexts/StoreContext';
import { Box } from '../Box/Box';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { Heading } from '../Heading/Heading';
import { Inline } from '../Inline/Inline';
import { ScrollContainer } from '../ScrollContainer/ScrollContainer';
import { Spread } from '../Spread/Spread';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';
import { SharedTooltipContext } from '../Tooltip/Tooltip';
import LoadingIcon from '../icons/LoadingIcon';

import { useAssistant } from './AssistantContext';
import { ChatForm } from './ChatForm/ChatForm';
import { ChatMessage } from './ChatMessage/ChatMessage';
import { Suggestion } from './Suggestion/Suggestion';

import * as styles from './AssistantPanel.css';

const loadingMessages = [
  'Generating...',
  'Pondering...',
  'Vibe coding...',
  'Procrastinating...',
  'Fiddling...',
  'Overthinking...',
  'Considering...',
  'Contemplating...',
];

export const AssistantPanel = () => {
  const [{ assistantHidden }, dispatch] = useContext(StoreContext);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const [activeSuggestion, setActiveSuggestion] = useState<string | null>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const userSelectedSuggestion = useRef(false);

  const { messages, errorMessage, reset, loading } = useAssistant();

  const lastMessage = messages[messages.length - 1];
  const awaitingResponse = loading && lastMessage?.role === 'user';
  const streamingResponse = loading && lastMessage?.role === 'assistant';

  useEffect(() => {
    if (awaitingResponse) {
      const chooseRandomLoadingMessage = () => {
        const randomIndex = Math.floor(Math.random() * loadingMessages.length);
        setLoadingMessage(loadingMessages[randomIndex]);
      };

      const intervalId = setInterval(chooseRandomLoadingMessage, 2000);
      chooseRandomLoadingMessage();

      return () => clearInterval(intervalId);
    }
  }, [awaitingResponse]);

  const hasError = Boolean(errorMessage);
  useLayoutEffect(() => {
    const el = messageContainerRef.current;
    el?.scrollTo(0, el.scrollHeight);
  }, [messages.length, lastMessage, hasError]);

  useEffect(() => {
    if (loading || assistantHidden) {
      setActiveSuggestion(null);
      userSelectedSuggestion.current = false;
    }
  }, [loading, assistantHidden]);

  useEffect(() => {
    if (
      !userSelectedSuggestion.current &&
      !activeSuggestion &&
      lastMessage?.variants.length > 0
    ) {
      const firstIndex = 0;
      setActiveSuggestion(`${lastMessage.id}_${firstIndex}`);
      dispatch({
        type: 'previewSuggestion',
        payload: { code: lastMessage.variants[firstIndex] },
      });
    }
  }, [dispatch, activeSuggestion, lastMessage.variants, lastMessage.id]);

  return (
    <aside className={styles.root}>
      <div className={styles.titleContainer}>
        <SharedTooltipContext>
          <Spread space="small" alignY="center">
            <Inline space="xsmall" alignY="center">
              <Heading level="3">Assistant</Heading>
              <Sparkles height={18} width={18} style={{ marginTop: '-2px' }} />
            </Inline>
            <div className={styles.assistantActions}>
              {messages.length > 1 && (
                <ButtonIcon
                  label="New chat"
                  icon={<SquarePen />}
                  onClick={reset}
                  size="small"
                />
              )}
            </div>
          </Spread>
        </SharedTooltipContext>
      </div>

      <ScrollContainer
        ref={messageContainerRef}
        direction="vertical"
        fadeSize="small"
      >
        <Box className={styles.messageContainer}>
          <Stack space="xxlarge">
            {messages.map((message, messageIndex) => (
              <Stack space="medium" key={message.id}>
                <ChatMessage
                  message={message}
                  groupWithPreviousMessage={
                    message.role === 'user' &&
                    messages[messageIndex - 1]?.role === message.role
                  }
                  streaming={streamingResponse}
                />

                {message.variants.length > 0 && (
                  <Stack space="xsmall">
                    {message.variants.map((suggestion, suggestionIndex) => {
                      const key = `${message.id}_${suggestionIndex}`;
                      const isActive = key === activeSuggestion;

                      return (
                        <Suggestion
                          key={key}
                          suggestion={suggestion}
                          active={isActive}
                          label={
                            message.variants.length > 1 || streamingResponse
                              ? `Variant ${suggestionIndex + 1}`
                              : 'View'
                          }
                          onApply={() => {
                            dispatch({
                              type: 'persistSuggestion',
                              payload: {
                                code: suggestion,
                              },
                            });
                            setActiveSuggestion(null);
                          }}
                          onPreview={() => {
                            userSelectedSuggestion.current = true;
                            if (isActive) {
                              setActiveSuggestion(null);
                              dispatch({ type: 'clearSuggestion' });
                            } else {
                              setActiveSuggestion(key);
                              dispatch({
                                type: 'previewSuggestion',
                                payload: { code: suggestion },
                              });
                            }
                          }}
                        />
                      );
                    })}
                  </Stack>
                )}
              </Stack>
            ))}
          </Stack>

          {awaitingResponse ? <Text>{loadingMessage}</Text> : null}

          {streamingResponse ? (
            <Text>
              <LoadingIcon />
            </Text>
          ) : null}

          {errorMessage ? <Text tone="critical">{errorMessage}</Text> : null}
        </Box>
      </ScrollContainer>

      <ChatForm />
    </aside>
  );
};
