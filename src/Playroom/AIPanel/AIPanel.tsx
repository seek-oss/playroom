import { useState, useContext, useEffect } from 'react';
import { type Message, useChat } from '@ai-sdk/react';
import { ToolbarPanel } from '../ToolbarPanel/ToolbarPanel';
import { StoreContext } from '../../StoreContext/StoreContext';
import { Heading } from '../Heading/Heading';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';
import { Button } from '../Button/Button';
import { Box } from '../Box/Box';
import * as styles from './AIPanel.css';

import type { PlayroomProps } from '../Playroom';

export default ({
  snippets,
  components,
}: {
  snippets: PlayroomProps['snippets'];
  components: PlayroomProps['components'];
}) => {
  const [state, dispatch] = useContext(StoreContext);
  const [error, setError] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('Generating...');

  const systemPrompt = `
You are an expert React developer specializing in UI component composition. Your task is to help users create UI layouts using only the components provided.

## Available Components

${Object.keys(components)}

## Component Snippets

${snippets.map(
  ({ name, code, group }) =>
    `### ${name} (${group})
\`\`\`jsx
${code}
\`\`\`
`
)}

## Instructions

1. Create concise, elegant layouts using ONLY the components listed above.
2. Generate valid JSX with proper nesting and indentation.
3. Use props as shown in the component definitions.
4. When modifying existing code, preserve the structure while making requested changes.
5. If the user asks for a component you don't have, use the closest available alternative.
6. MUST follow snippets examples and syntax. For example, if a component is nested in a provider, you must always add the provider.

${
  state.aiExamples && state.aiExamples.length > 0
    ? `
## Example usage

Here are some example components that demonstrate best practices:

${state.aiExamples
  .map(
    ({ name, code, description }) =>
      `### ${name}${description ? ` - ${description}` : ''}
\`\`\`jsx
${code}
\`\`\`
`
  )
  .join('\n')}
`
    : ''
}

## Response Format (VERY IMPORTANT)

- RETURN ONLY RAW AND VALID JSX CODE - no explanations, no markdown, no code blocks (.e.g \`\`\`JSX).
- Your code will be directly rendered in the UI.
- Ensure all opening tags have matching closing tags.
- Include appropriate whitespace for readability.
`;

  const preprompt: Message[] = [
    {
      id: 'system-1',
      role: 'system',
      content: systemPrompt,
    },

    ...(state.code
      ? [
          {
            id: 'initial-code',
            role: 'system' as const,
            content: `Current code to modify if requested:\n\n${state.code}`,
          },
        ]
      : []),

    {
      id: 'welcome',
      role: 'assistant',
      content: state.code
        ? 'What changes would you like to make?'
        : "Describe what you'd like to build!",
    },
  ];

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    setMessages,
    error: chatError,
  } = useChat({
    api: 'http://localhost:8080/api/chat',
    initialMessages: preprompt,
    onFinish: (message) => {
      dispatch({
        type: 'updateCode',
        payload: {
          code: message.content,
        },
      });
    },
    onError: (err) => {
      setError(err.message || 'An error occurred while generating UI');
    },
  });

  const displayMessages = messages.filter((msg) => msg.role !== 'system');
  const clearConversation = () => {
    setMessages(preprompt);
  };

  useEffect(() => {
    if (status === 'streaming' || status === 'submitted') {
      const loadingMessages = [
        'Pondering...',
        'Hacking...',
        'Procrastinating...',
        'Fiddling...',
        'Overthinking...',
        'Daydreaming...',
        'Turtle-coding...',
        'Shell-scripting...',
        'Considering...',
        'Contemplating...',
      ];

      const intervalId = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * loadingMessages.length);
        setLoadingMessage(loadingMessages[randomIndex]);
      }, 2000);

      const randomIndex = Math.floor(Math.random() * loadingMessages.length);
      setLoadingMessage(loadingMessages[randomIndex]);

      return () => clearInterval(intervalId);
    }
  }, [status]);

  const loading = status === 'streaming' || status === 'submitted';

  return (
    <ToolbarPanel>
      <Stack space="large">
        <Heading level="3">AI Assistant</Heading>

        {displayMessages.length > 0 && (
          <Box className={styles.conversationContainer}>
            {displayMessages.map((msg) => (
              <Box
                key={msg.id}
                className={`${styles.messageContainer} ${
                  msg.role === 'user'
                    ? styles.userMessage
                    : styles.assistantMessage
                }`}
              >
                <Text
                  tone={msg.role === 'user' ? 'neutral' : 'secondary'}
                  weight={msg.role === 'user' ? 'regular' : 'strong'}
                >
                  {msg.role === 'user' ? `🧑 You: ` : `🤖 AI: `}
                  {msg.role === 'user' || msg.id === 'welcome'
                    ? msg.content
                    : `${msg.content.slice(
                        msg.content.length - 100,
                        msg.content.length
                      )}...`}
                </Text>
              </Box>
            ))}
          </Box>
        )}

        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        >
          <Box className={styles.field}>
            <Stack space="xsmall">
              <textarea
                className={styles.textField}
                value={input}
                onChange={handleInputChange}
                placeholder={
                  state.code
                    ? 'Example: Change the background color to blue, add spacing between items...'
                    : 'Example: Create a product card with image, title, price and buy button...'
                }
              />
            </Stack>
          </Box>

          <Stack space="small">
            <Button type="submit" disabled={loading || !input.trim()}>
              {loading ? (
                <span>
                  <span className={styles.spinningAnimation}>🐢</span>
                  <span style={{ paddingLeft: 10 }}>{loadingMessage}</span>
                </span>
              ) : (
                'Generate UI'
              )}
            </Button>

            {displayMessages.length > 0 && (
              <Button onClick={clearConversation}>Reset</Button>
            )}
          </Stack>
        </form>

        {error || chatError ? (
          <Box className={styles.status}>
            <Text tone="critical" weight="strong">
              {error || chatError?.message || 'An error occurred'}
            </Text>
          </Box>
        ) : null}
      </Stack>
    </ToolbarPanel>
  );
};
