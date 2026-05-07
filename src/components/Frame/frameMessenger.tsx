import { snapdom } from '@zumer/snapdom';
import { type ComponentProps, useEffect, useRef, useState } from 'react';

import { FrameError } from './FrameError';

/**
 * ---------------
 *  Error Message
 * ---------------
 */
const PlayroomErrorSource = 'Playroom Frame Error';

export const ErrorMessageSender = ({
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

interface ReceiveErrorMessageProps {
  size?: ComponentProps<typeof FrameError>['size'];
}

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

/**
 * --------------------
 *  Screenshot Message
 * --------------------
 */
const playroomScreenshotSource = 'Playroom Frame Screenshot';

const renderDocumentToCanvas = async (doc: Document) => {
  const result = await snapdom(doc.documentElement, {
    embedFonts: true,
    useProxy:
      process.env.NODE_ENV === 'development'
        ? 'https://proxy.corsfix.com/?'
        : undefined,
    backgroundColor: '#fff',
    fallbackURL: ({ width, height }) =>
      `https://placehold.co/${width}${
        height ? `x${height}` : ''
      }/eee/aaa?text=CORS%20blocked%20image`,
  });

  return result;
};
export const ScreenshotMessageReceiver = () => {
  useEffect(() => {
    const screenshotMessageHandler = async (event: MessageEvent) => {
      const { source, action, fileName } = event.data;

      if (source === playroomScreenshotSource) {
        switch (action) {
          case 'copy': {
            const image = await renderDocumentToCanvas(document);
            const blob = await image.toBlob({ type: 'png' });
            const clipboardItem = new ClipboardItem({ [blob.type]: blob });
            await window.parent.navigator.clipboard.write([clipboardItem]);
            return;
          }
          case 'download': {
            const image = await renderDocumentToCanvas(document);
            image.download({ format: 'png', filename: fileName });
            return;
          }
        }
      }
    };

    window.addEventListener('message', screenshotMessageHandler, false);

    return () => {
      window.removeEventListener('message', screenshotMessageHandler, false);
    };
  }, []);

  return null;
};

/**
 * -------------------
 *  Inspect Message
 * -------------------
 */
const PlayroomInspectSource = 'Playroom Inspect';

export const inspectMessageSender = ({
  messageWindow,
  action,
}: {
  messageWindow: Window;
  action: 'enable' | 'disable';
}) => {
  messageWindow.postMessage({ source: PlayroomInspectSource, action }, '*');
};

interface InspectMessageReceiverProps {
  onHover: (line: number | null) => void;
  onSelect: (line: number) => void;
  onExit: () => void;
}

export const InspectMessageReceiver = ({
  onHover,
  onSelect,
  onExit,
}: InspectMessageReceiverProps) => {
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.source !== PlayroomInspectSource) {
        return;
      }

      switch (event.data.type) {
        case 'hover':
          onHover(event.data.line ?? null);
          break;
        case 'select':
          if (typeof event.data.line === 'number') {
            onSelect(event.data.line);
          }
          break;
        case 'exit':
          onExit();
          break;
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onHover, onSelect, onExit]);

  return null;
};

export { PlayroomInspectSource };
