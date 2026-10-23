import { useEffect, useState } from 'react';

export const useCopy = () => {
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    if (copying) {
      setTimeout(() => {
        setCopying(false);
      }, 2000);
    }
  }, [copying]);

  const onCopyClick = async (content: string) => {
    if (!copying) {
      setCopying(true);
      const clipboardItem = new ClipboardItem({ 'text/plain': content });
      await navigator.clipboard.write([clipboardItem]);
    }
  };

  return {
    copying,
    onCopyClick,
  };
};
