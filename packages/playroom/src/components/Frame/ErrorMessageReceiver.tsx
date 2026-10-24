import { type ComponentProps, useEffect, useRef, useState } from 'react';

import { FrameError } from './FrameError';
import { PlayroomErrorSource } from './frameMessenger';

interface ReceiveErrorMessageProps {
  size?: ComponentProps<typeof FrameError>['size'];
}

// Kept out of `frameMessenger` so frames don't bundle `FrameError` and its styles
export const ErrorMessageReceiver = ({ size }: ReceiveErrorMessageProps) => {
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

  return (
    <FrameError
      message={error}
      size={size}
      delayVisibility={shouldDelay.current}
    />
  );
};
