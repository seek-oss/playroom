import React, { useEffect, useRef, useState } from 'react';
import copy from 'copy-to-clipboard';

// @ts-ignore
// eslint-disable-next-line css-modules/no-unused-class
import styles from './ShareMenu.less';
import CopyIcon from './CopyIcon';

const SideSpacer = () => <div className={styles.hspace} />;

interface CopyButtonProps {
  copyContent: string;
}
export default ({ copyContent }: CopyButtonProps) => {
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
    <button
      className={styles.copyToClipboard}
      onClick={onClick}
      data-testid="copy-to-clipboard"
    >
      {copying ? 'Copied' : 'Copy link'}
      <SideSpacer />
      <CopyIcon size={14} />
    </button>
  );
};
