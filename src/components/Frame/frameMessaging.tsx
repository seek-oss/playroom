import { useEffect, useRef, useState } from 'react';

import { FrameError } from './FrameError';

const PlayroomErrorSource = 'Playroom Frame Error';

export const SendErrorMessage = ({
  message,
  delayVisibility,
}: {
  message: string;
  delayVisibility?: boolean;
}) => {
  useEffect(() => {
    window.parent.postMessage({
      source: PlayroomErrorSource,
      message,
      delayVisibility,
    });
  }, [message, delayVisibility]);

  return null;
};

export const ReceiveErrorMessage = () => {
  const shouldDelay = useRef(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const errorMessageHandler = (event: MessageEvent) => {
      const { source, message, delayVisibility } = event.data;
      if (source === PlayroomErrorSource) {
        setError(message);
        shouldDelay.current = delayVisibility;
      }
    };

    window.addEventListener('message', errorMessageHandler, false);

    return () => {
      window.removeEventListener('message', errorMessageHandler, false);
    };
  }, []);

  return <FrameError message={error} delayVisibility={shouldDelay.current} />;
};
