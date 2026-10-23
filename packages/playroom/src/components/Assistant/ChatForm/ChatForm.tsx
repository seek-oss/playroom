import { Send, Square } from 'lucide-react';
import { type FormEvent, useContext, useEffect, useRef, useState } from 'react';

import { StoreContext } from '../../../contexts/StoreContext';
import { ButtonIcon } from '../../ButtonIcon/ButtonIcon';
import { Inline } from '../../Inline/Inline';
import { Spread } from '../../Spread/Spread';
import { Stack } from '../../Stack/Stack';
import { useAssistant } from '../AssistantContext';
import { ImageAttachment } from '../ImageAttachment/ImageAttachment';
import { TalkButton } from '../TalkButton/TalkButton';

import { AttachCode } from './AttachCode';
import { AttachImage } from './AttachImage';
import { ChatField } from './ChatField';

import * as styles from './ChatForm.css';

export const ChatForm = () => {
  const [{ code, assistantHidden }] = useContext(StoreContext);
  const [input, setInput] = useState('');
  const fieldRef = useRef<HTMLTextAreaElement>(null);

  const { handleSubmit, loading, imageDataUrl, setImageDataUrl, stop } =
    useAssistant();

  const clearImageInput = () => {
    setImageDataUrl(null);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!loading && input.trim()) {
      handleSubmit(input);
      clearImageInput();
      setInput('');
      fieldRef.current?.focus();
    }
  };

  useEffect(() => {
    if (assistantHidden === false) {
      fieldRef.current?.focus();
    }
  }, [assistantHidden]);

  return (
    <form
      onSubmit={onSubmit}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          onSubmit(e);
        }
      }}
      className={styles.form}
    >
      {imageDataUrl ? (
        <div className={styles.attachmentContainer}>
          <ImageAttachment
            src={imageDataUrl}
            alt="Uploaded image"
            size="small"
            onRemove={clearImageInput}
          />
        </div>
      ) : null}
      <Stack space="large">
        <ChatField
          ref={fieldRef}
          value={input}
          onChange={(ev) => {
            setInput(ev.currentTarget.value);
          }}
          placeholder="Type a message..."
        />
        <div className={styles.focusIndicator} />
        <div className={styles.actionsContainer}>
          <Spread space="small">
            <Inline space="medium" alignY="center" nowrap>
              <AttachImage onAttach={() => fieldRef.current?.focus()} />
              {code.trim().length > 0 && <AttachCode />}
            </Inline>

            <Inline space="xsmall" nowrap>
              <TalkButton onComplete={setInput} />
              <ButtonIcon
                type={loading ? 'button' : 'submit'}
                size="large"
                variant={loading ? 'solid' : 'standard'}
                disabled={!loading && input.trim().length === 0}
                disabledReason="Enter a message first"
                label={loading ? 'Stop' : 'Send'}
                onClick={loading ? stop : undefined}
                icon={
                  loading ? (
                    <Square style={{ strokeWidth: 0, fill: 'currentcolor' }} />
                  ) : (
                    <Send />
                  )
                }
              />
            </Inline>
          </Spread>
        </div>
      </Stack>
    </form>
  );
};
