import { PanelRightClose, Sparkles, SquarePen } from 'lucide-react';
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
  'Daydreaming...',
  'Turtle-coding...',
  'Shell-scripting...',
  'Considering...',
  'Contemplating...',
];

export const AssistantPanel = () => {
  const [, dispatch] = useContext(StoreContext);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    errorMessage,
    reset,
    loading,
    applySuggestion,
    activeSuggestion,
    previewSuggestion,
    resetActiveSuggestion,
  } = useAssistant();

  useEffect(() => {
    if (loading) {
      const chooseRandomLoadingMessage = () => {
        const randomIndex = Math.floor(Math.random() * loadingMessages.length);
        setLoadingMessage(loadingMessages[randomIndex]);
      };

      const intervalId = setInterval(chooseRandomLoadingMessage, 2000);
      chooseRandomLoadingMessage();

      return () => clearInterval(intervalId);
    }
  }, [loading]);

  const hasError = Boolean(errorMessage);
  useLayoutEffect(() => {
    const el = messageContainerRef.current;
    el?.scrollTo(0, el.scrollHeight);
  }, [messages.length, loading, hasError]);

  return (
    <aside className={styles.root}>
      <div className={styles.titleContainer}>
        <SharedTooltipContext>
          <Spread space="small" alignY="center">
            <Inline space="xsmall" alignY="center">
              <Heading level="3">Assistant</Heading>
              <Sparkles height={18} width={18} style={{ marginTop: '-2px' }} />
            </Inline>
            <Inline space="xsmall">
              {messages.length > 1 && (
                <ButtonIcon
                  label="New chat"
                  icon={<SquarePen />}
                  onClick={reset}
                  size="small"
                />
              )}
              <ButtonIcon
                label="Hide Assistant"
                icon={<PanelRightClose />}
                onClick={() => {
                  dispatch({ type: 'hideAssistant' });
                  resetActiveSuggestion();
                }}
                size="small"
              />
            </Inline>
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
                />

                {message.variants.length > 0 && (
                  <Stack space="xsmall">
                    {message.variants.map((suggestion, suggestionIndex) => (
                      <Suggestion
                        key={`${message.id}_${suggestionIndex}`}
                        suggestion={suggestion}
                        active={Boolean(
                          activeSuggestion &&
                            message.id === activeSuggestion.messageId &&
                            suggestionIndex === activeSuggestion.suggestionIndex
                        )}
                        label={
                          message.variants.length > 1
                            ? `View ${suggestionIndex + 1}`
                            : 'View'
                        }
                        onApply={() => applySuggestion(suggestion)}
                        onPreview={() =>
                          previewSuggestion({
                            id: message.id,
                            code: suggestion,
                            suggestionIndex,
                          })
                        }
                      />
                    ))}
                  </Stack>
                )}
              </Stack>
            ))}
          </Stack>

          {loading ? <Text>{loadingMessage}</Text> : null}

          {errorMessage ? <Text tone="critical">{errorMessage}</Text> : null}
        </Box>
      </ScrollContainer>

      <ChatForm />
    </aside>
  );
};
