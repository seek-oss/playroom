import React, { useEffect, useRef, useState } from 'react';
import copy from 'copy-to-clipboard';

import { ShareButton } from './ShareButton';
import { CopyIcon } from './CopyIcon';

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
    <ShareButton onClick={onClick} data-testid="copy-to-clipboard">
      <div style={{ display: 'block' }}>
        {copying ? 'Copied ' : 'Copy link '}
        <div style={{ display: 'inline' }}>
          <CopyIcon size={16} />
        </div>
      </div>
    </ShareButton>
  );
};
