import { Volume2 } from 'lucide-react';
import { useRef, useEffect } from 'react';

import { Box } from '../../Box/Box';
import { ButtonIcon } from '../../ButtonIcon/ButtonIcon';
import { Stack } from '../../Stack/Stack';
import { Text } from '../../Text/Text';
import type { AssistantContextValue } from '../AssistantContext';
import { ImageAttachment } from '../ImageAttachment/ImageAttachment';

import * as styles from './ChatMessage.css';

const speakThis = (str: string, synth: typeof window.speechSynthesis) => {
  const voices = synth.getVoices();
  const voicesByName = voices.reduce(
    (acc, v) => ({
      ...acc,
      [v.name]: v,
    }),
    {} as Record<string, (typeof voices)[number]>
  );
  const preferredVoice =
    voicesByName['Google UK English Female'] ||
    voicesByName.Moira ||
    voicesByName.Karen ||
    undefined;
  const utterThis = new SpeechSynthesisUtterance(str);
  utterThis.voice = preferredVoice;
  utterThis.pitch = 1;
  utterThis.rate = 1;
  synth.speak(utterThis);
};

interface Props {
  message: AssistantContextValue['messages'][number];
  groupWithPreviousMessage?: boolean;
  streaming?: boolean;
}

export const ChatMessage = ({
  message,
  groupWithPreviousMessage,
  streaming,
}: Props) => {
  const speechRef = useRef<typeof window.speechSynthesis | null>(null);
  const isUserMessage = message.role === 'user';

  useEffect(() => {
    speechRef.current = window.speechSynthesis;
    // First use of synth does not pick up the correct voice.
    // Calling `getVoices` straight up resolves this.
    speechRef.current.getVoices();
  }, []);

  return (
    <Box
      className={{
        [styles.message]: true,
        [styles.assistantMessage]: !isUserMessage,
        [styles.userMessage]: isUserMessage,
        [styles.userMessageBlock]: groupWithPreviousMessage,
      }}
    >
      <Stack space="small">
        <Text>
          {message.content}
          {!isUserMessage && !streaming ? (
            <span className={styles.readMessage}>
              <ButtonIcon
                label="Listen to assistant"
                variant="transparent"
                size="small"
                onClick={() => {
                  if (speechRef.current) {
                    speakThis(message.content, speechRef.current);
                  }
                }}
                icon={<Volume2 />}
              />
            </span>
          ) : null}
        </Text>
        {message.attachment ? (
          <ImageAttachment src={message.attachment} alt="Uploaded image" />
        ) : null}
      </Stack>
    </Box>
  );
};
