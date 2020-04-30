import React, { useEffect, useRef, useState } from 'react';
import copy from 'copy-to-clipboard';

import TickIcon from '../icons/TickIcon';
import CopyIcon from '../icons/CopyIcon';
import { Button } from '../Button/Button';

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
    <Button
      onClick={onClick}
      data-testid="copy-to-clipboard"
      tone={copying ? 'positive' : undefined}
      icon={copying ? <TickIcon size={18} /> : <CopyIcon size={18} />}
    >
      {copying ? 'Copied ' : 'Copy link '}
    </Button>
  );
};
