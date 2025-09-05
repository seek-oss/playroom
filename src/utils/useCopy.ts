import copy from 'copy-to-clipboard';
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

  const onCopyClick = (content: string) => {
    if (!copying) {
      copy(content);
      setCopying(true);
    }
  };

  return {
    copying,
    onCopyClick,
  };
};
