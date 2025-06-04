import { useEffect, useState } from 'react';

import { ErrorMessage } from '../RenderError/RenderError';

const PlayroomErrorSource = 'Playroom Frame Error';

export const SendErrorMessage = ({
  errorMessage,
}: {
  errorMessage: string;
}) => {
  useEffect(() => {
    window.parent.postMessage({
      source: PlayroomErrorSource,
      message: errorMessage,
    });
  }, [errorMessage]);

  return null;
};

export const ReceiveErrorMessage = () => {
  const [error, setError] = useState('');

  useEffect(() => {
    const errorMessageHandler = (event: MessageEvent) => {
      const { source, message } = event.data;
      if (source === PlayroomErrorSource) {
        setError(message);
      }
    };

    window.addEventListener('message', errorMessageHandler, false);

    return () => {
      window.removeEventListener('message', errorMessageHandler, false);
    };
  }, []);

  return <ErrorMessage errorMessage={error} delayVisibility />;
};
