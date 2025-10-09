import clsx from 'clsx';
import { X } from 'lucide-react';
import { useState } from 'react';

import { useDocumentTitle } from '../../utils/useDocumentTitle';
import { Button } from '../Button/Button';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { ErrorMessageReceiver } from '../Frame/frameMessenger';
import { popOutWindowName } from '../Frames/Frames';
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
      <Logo size={logoSize} wordmark />
      <span className={styles.headerDescription}>
        <Text tone="secondary" size="small">
          View is the result of user-provided code
        </Text>
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
    <Logo size={logoSize} wordmark />
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
  const editorHref = window.location.href.replace(/\/preview\/$/, '/');
  const absoluteSrc = new URL(
    frameSrc({ themeName, code }),
    editorHref
  ).toString();

  const isEmbedded =
    typeof window !== 'undefined' && window.self !== window.top;

  const isStandalone =
    typeof window !== 'undefined' && window.name === popOutWindowName;

  return (
    <div
      className={clsx([
        styles.root,
        isEmbedded ? styles.rootEmbedded : undefined,
      ])}
    >
      {!isStandalone && !headerHidden && !isEmbedded ? (
        <PreviewHeader
          editorHref={editorHref}
          onHideHeader={() => setHeaderHidden(true)}
        />
      ) : null}
      <div className={styles.frameContainer}>
        <iframe
          src={absoluteSrc}
          className={styles.iframe}
          data-testid="previewIframe"
        />
        <ErrorMessageReceiver size="large" />
      </div>
      {isEmbedded ? <PreviewFooter editorHref={editorHref} /> : null}
    </div>
  );
};
