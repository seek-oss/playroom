import { useCopy } from '../../utils/useCopy';
import { Button } from '../Button/Button';
import ShareIcon from '../icons/ShareIcon';
import TickIcon from '../icons/TickIcon';

interface CopyButtonProps {
  copyContent: string;
  title?: string;
}
export const CopyButton = ({ copyContent, title }: CopyButtonProps) => {
  const { copying, onCopyClick } = useCopy();

  return (
    <Button
      onClick={() => onCopyClick(copyContent)}
      tone={copying ? 'positive' : undefined}
      icon={copying ? <TickIcon size={18} /> : <ShareIcon size={18} />}
    >
      {copying ? 'Copied ' : title}
    </Button>
  );
};
