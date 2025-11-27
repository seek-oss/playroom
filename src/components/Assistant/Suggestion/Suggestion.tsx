import { Check, Copy } from 'lucide-react';

import { useCopy } from '../../../utils/useCopy';
import { Box } from '../../Box/Box';
import { Button } from '../../Button/Button';
import { ButtonIcon } from '../../ButtonIcon/ButtonIcon';
import { Inline } from '../../Inline/Inline';
import { Spread } from '../../Spread/Spread';
import { Text } from '../../Text/Text';

import * as styles from './Suggestion.css';

interface SuggestionVariantProps {
  suggestion: string;
  label: string;
  active: boolean;
  onApply: () => void;
  onPreview: () => void;
}

export const Suggestion = ({
  suggestion: variant,
  label,
  active,
  onApply,
  onPreview: onSelect,
}: SuggestionVariantProps) => {
  const { onCopyClick, copying } = useCopy();

  return (
    <Box
      className={{
        [styles.root]: true,
        [styles.selected]: active,
      }}
    >
      <button
        aria-label="View suggestion"
        className={styles.button}
        onClick={onSelect}
      />
      <div className={styles.label}>
        <Spread space="medium" alignY="center">
          <Text weight={active ? 'strong' : undefined}>{label}</Text>
          <div className={styles.actionsContainer}>
            <Inline space="xsmall" alignY="center">
              <ButtonIcon
                label={copying ? 'Copied' : 'Copy code'}
                tone={copying ? 'positive' : undefined}
                onClick={() => onCopyClick(variant)}
                icon={copying ? <Check size={16} /> : <Copy />}
              />
              <Button onClick={onApply}>Apply</Button>
            </Inline>
          </div>
        </Spread>
      </div>
    </Box>
  );
};
