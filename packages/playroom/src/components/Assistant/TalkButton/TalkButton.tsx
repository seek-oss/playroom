import { Mic } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { ButtonIcon } from '../../ButtonIcon/ButtonIcon';

type Props = {
  onComplete?: (transcript: string) => void;
};

interface ResultEvent {
  results: Array<Array<{ transcript: string }>>;
}

interface SpeechInstance {
  lang: string;
  onresult: (event: ResultEvent) => void;
  start: () => void;
  onstart: (event: any) => void;
  onend: (event: any) => void;
}

export const TalkButton = ({ onComplete, ...restProps }: Props) => {
  const [listening, setListening] = useState(false);
  const [initialised, setInitialised] = useState(false);
  const speechRef = useRef<SpeechInstance | null>(null);

  useEffect(() => {
    const SpeechAPI =
      // @ts-expect-error No types yet
      window.SpeechRecognition ||
      // @ts-expect-error No types yet
      window.webkitSpeechRecognition ||
      // @ts-expect-error No types yet
      window.mozSpeechRecognition ||
      // @ts-expect-error No types yet
      window.msSpeechRecognition;

    if (SpeechAPI) {
      const recognition = new SpeechAPI();
      recognition.lang = 'en_US';
      speechRef.current = recognition as SpeechInstance;
    }

    setInitialised(true);
  }, []);

  return initialised && speechRef.current ? (
    <ButtonIcon
      {...restProps}
      variant={listening ? 'solid' : 'standard'}
      size="large"
      onClick={() => {
        if (speechRef.current) {
          speechRef.current.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (transcript && typeof onComplete === 'function') {
              onComplete(transcript);
            }
          };
          speechRef.current.start();
          speechRef.current.onstart = () => setListening(true);
          speechRef.current.onend = () => setListening(false);
        }
      }}
      label="Speak"
      icon={<Mic />}
    />
  ) : null;
};
