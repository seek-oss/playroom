import React, { useEffect, useRef, useState } from 'react';
import copy from 'copy-to-clipboard';

import { ShareButton } from './ShareButton';
import { CopyIcon } from './CopyIcon';
import { TickIcon } from './TickIcon';

interface CopyButtonProps {
  copyContent: string;
}
export const CopyButton = ({ copyContent }: CopyButtonProps) => {
  const [copying, setCopying] = useState(false);
  const copyLocked = useRef(false);

  useEffect(() => {
    if (copying && !copyLocked.current) {
      copyLocked.current = true;

      copy(copyContent);

      setTimeout(() => {
        copyLocked.current = false;

        setCopying(false);
      }, 2000);
    }
  }, [copying, copyContent]);

  const onClick = () => {
    if (!copying) {
      setCopying(true);
    }
  };

  return (
    <ShareButton
      slim
      onClick={onClick}
      data-testid="copy-to-clipboard"
      tone={copying ? 'positive' : undefined}
      icon={copying ? <TickIcon size={18} /> : <CopyIcon size={18} />}
    >
      {copying ? 'Copied ' : 'Copy link '}
    </ShareButton>
  );
};
