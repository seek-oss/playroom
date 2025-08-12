import copy from 'copy-to-clipboard';
import { useEffect, useRef, useState } from 'react';

import { Button } from '../Button/Button';
import ShareIcon from '../icons/ShareIcon';
import TickIcon from '../icons/TickIcon';

interface CopyButtonProps {
  copyContent?: string;
  title?: string;
}
export const CopyButton = ({ copyContent, title }: CopyButtonProps) => {
  const [copying, setCopying] = useState(false);
  const copyLocked = useRef(false);

  useEffect(() => {
    if (copying && !copyLocked.current) {
      copyLocked.current = true;

      copy(copyContent || window.location.href);

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
      title={title}
      tone={copying ? 'positive' : undefined}
      icon={copying ? <TickIcon size={18} /> : <ShareIcon size={18} />}
    >
      {copying ? 'Copied ' : 'Copy link '}
    </Button>
  );
};
