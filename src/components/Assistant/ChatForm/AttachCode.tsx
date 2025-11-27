import { Check } from 'lucide-react';

import { Inline } from '../../Inline/Inline';
import { Text } from '../../Text/Text';
import { Tooltip } from '../../Tooltip/Tooltip';
import { useAssistant } from '../AssistantContext';

import * as styles from './AttachCode.css';

const tooltips = {
  editable: {
    attached: 'Remove code from context',
    unattached: 'Attach code as context',
  },
  uneditable: {
    attached: 'Code provided as context',
    unattached: 'Code not provided as context',
  },
};

export const AttachCode = () => {
  const { attachCode, setAttachCode, messages } = useAssistant();

  const hasAttachedCodeToChat = messages.length > 1;

  return (
    <Tooltip
      label={
        tooltips[hasAttachedCodeToChat ? 'uneditable' : 'editable'][
          attachCode ? 'attached' : 'unattached'
        ]
      }
      announceAsDescription={hasAttachedCodeToChat}
      trigger={
        <label htmlFor="codeToggle" className={styles.checkboxLabel}>
          <Inline space="xsmall" alignY="center" nowrap>
            <Text tone={hasAttachedCodeToChat ? 'secondary' : undefined}>
              Include code
            </Text>
            <input
              type="checkbox"
              id="codeToggle"
              aria-disabled={hasAttachedCodeToChat}
              checked={attachCode}
              className={styles.realCheckbox}
              onChange={(ev) => {
                if (!hasAttachedCodeToChat) {
                  setAttachCode(ev.target.checked);
                }
              }}
            />
            <span className={styles.fakeCheckbox}>
              {attachCode ? (
                <span
                  aria-checked={attachCode}
                  role="checkbox"
                  className={styles.checkboxItemIndicator}
                >
                  <Check size={12} />
                </span>
              ) : null}
            </span>
          </Inline>
        </label>
      }
    />
  );
};
