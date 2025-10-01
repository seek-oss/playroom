import clsx from 'clsx';
import { X } from 'lucide-react';
import { useState } from 'react';

import { useDocumentTitle } from '../../utils/useDocumentTitle';
import { Button } from '../Button/Button';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { ReceiveErrorMessage } from '../Frame/frameMessaging';
import frameSrc from '../Frames/frameSrc';
import { logoSize } from '../Header/Header';
import { Logo } from '../Logo/Logo';
import { Text } from '../Text/Text';

import * as styles from './Preview.css';

interface PreviewProps {
  title?: string;
  code: string;
  themeName: string;
}

const PreviewHeader = ({
  editorHref,
  onHideHeader,
}: {
  editorHref: string;
  onHideHeader: () => void;
}) => (
  <div className={styles.header}>
    <div className={styles.leftGroup}>
      <Logo size={logoSize} />
      <span className={styles.headerDescription}>
        <Text tone="secondary">Previewing user-provided code</Text>
      </span>
    </div>
    <div className={styles.actions}>
      <Button as="a" href={editorHref} target="_blank" rel="noreferrer">
        Edit in Playroom
      </Button>
      <ButtonIcon label="Dismiss" icon={<X />} onClick={onHideHeader} />
    </div>
  </div>
);

const PreviewFooter = ({ editorHref }: { editorHref: string }) => (
  <div className={styles.footer}>
    <div className={styles.leftGroup}>
      <Logo size={logoSize} />
      <Text tone="secondary">Playroom</Text>
    </div>
    <div className={styles.actions}>
      <Button as="a" href={editorHref} target="_blank" rel="noreferrer">
        Open
      </Button>
    </div>
  </div>
);

export default ({ title, code, themeName }: PreviewProps) => {
  useDocumentTitle({ title, suffix: 'Playroom Preview' });

  const [headerHidden, setHeaderHidden] = useState(false);
  const absoluteSrc = new URL(
    frameSrc({ themeName, code }),
    window.location.origin
  ).toString();

  const editorHref = window.location.href.replace('/preview', '');
  const isEmbedded =
    typeof window !== 'undefined' && window.self !== window.top;

  return (
    <div
      className={clsx([
        styles.root,
        isEmbedded ? styles.rootEmbedded : undefined,
      ])}
    >
      {!headerHidden && !isEmbedded ? (
        <PreviewHeader
          editorHref={editorHref}
          onHideHeader={() => setHeaderHidden(true)}
        />
      ) : null}
      <div className={styles.frameContainer}>
        <iframe src={absoluteSrc} className={styles.iframe} />
        <ReceiveErrorMessage size="large" />
      </div>
      {isEmbedded ? <PreviewFooter editorHref={editorHref} /> : null}
    </div>
  );
};
