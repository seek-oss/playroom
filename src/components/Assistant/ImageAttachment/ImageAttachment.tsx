import clsx from 'clsx';
import { X } from 'lucide-react';
import type { AllHTMLAttributes } from 'react';

import { ButtonIcon } from '../../ButtonIcon/ButtonIcon';

import * as styles from './ImageAttachment.css';

interface Props {
  src: string;
  alt: string;
  size?: keyof typeof styles.size;
  onRemove?: AllHTMLAttributes<HTMLButtonElement>['onClick'];
}

export const ImageAttachment = ({
  src,
  alt,
  size = 'standard',
  onRemove,
}: Props) => (
  <div className={styles.imageAttachment}>
    <img
      src={src}
      className={clsx(styles.attachmentImage, styles.size[size])}
      alt={alt}
    />
    {onRemove ? (
      <div className={styles.removeContainer}>
        <ButtonIcon
          label="Remove image"
          onClick={onRemove}
          size="small"
          icon={<X />}
        />
      </div>
    ) : null}
  </div>
);
