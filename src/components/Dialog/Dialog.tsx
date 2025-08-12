import { Dialog as BaseUIDialog } from '@base-ui-components/react';
import { useId, type ComponentProps } from 'react';

import { Box } from '../Box/Box';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { Heading } from '../Heading/Heading';
import { Inline } from '../Inline/Inline';
import { Stack } from '../Stack/Stack';
import DismissIcon from '../icons/DismissIcon';

import * as styles from './Dialog.css';

interface Props {
  title: string;
  open: ComponentProps<typeof BaseUIDialog.Root>['open'];
  onOpenChange: NonNullable<
    ComponentProps<typeof BaseUIDialog.Root>['onOpenChange']
  >;
  finalFocus?: ComponentProps<typeof BaseUIDialog.Popup>['finalFocus'];
  children: ComponentProps<typeof BaseUIDialog.Popup>['children'];
}

export const Dialog = ({ open, onOpenChange, finalFocus, children }: Props) => {
  const titleId = useId();

  return (
    <BaseUIDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseUIDialog.Portal>
        <BaseUIDialog.Backdrop className={styles.backdrop} />
        <BaseUIDialog.Popup
          className={styles.popup}
          finalFocus={finalFocus}
          aria-labelledby={titleId}
        >
          <Stack space="large">
            <Inline space="small" alignY="center">
              <Box flexGrow={1}>
                <Heading level="3" id={titleId}>
                  Keyboard Shortcuts
                </Heading>
              </Box>
              <BaseUIDialog.Close
                render={<ButtonIcon icon={<DismissIcon />} label="Close" />}
              />
            </Inline>

            <>{children}</>
          </Stack>
        </BaseUIDialog.Popup>
      </BaseUIDialog.Portal>
    </BaseUIDialog.Root>
  );
};
