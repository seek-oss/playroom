import { Image } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { ButtonIcon } from '../../ButtonIcon/ButtonIcon';
import { useAssistant } from '../AssistantContext';

import * as styles from './AttachImage.css';

interface Props {
  onAttach?: () => void;
}

export const AttachImage = ({ onAttach }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { imageDataUrl, setImageDataUrl } = useAssistant();

  const handleFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.currentTarget.files?.[0];
    if (!file) {
      setImageDataUrl(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageDataUrl(e.target?.result as string);
      onAttach?.();
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (fileInputRef.current && !imageDataUrl) {
      fileInputRef.current.value = '';
    }
  }, [imageDataUrl]);

  return (
    <div className={styles.imageActionContainer}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/gif, image/webp"
        className={styles.imageInput}
        onChange={handleFileChange}
        tabIndex={-1}
      />
      <ButtonIcon
        label="Upload Image"
        icon={<Image />}
        size="large"
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(ev) => {
          if (ev.key === 'Enter') {
            ev.stopPropagation();
            ev.preventDefault();
            fileInputRef.current?.click();
          }
        }}
      />
    </div>
  );
};
