import { Dialog as BaseUIDialog } from '@base-ui-components/react';
import { useId, useRef, type ComponentProps } from 'react';

import { Box } from '../Box/Box';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { Heading } from '../Heading/Heading';
import { Stack } from '../Stack/Stack';
import DismissIcon from '../icons/DismissIcon';

import * as styles from './Dialog.css';

type BaseUIDialogRoot = ComponentProps<typeof BaseUIDialog.Root>;
type BaseUIDialogPopup = ComponentProps<typeof BaseUIDialog.Popup>;

interface Props {
  title: string;
  open: BaseUIDialogRoot['open'];
  onOpenChange: NonNullable<BaseUIDialogRoot['onOpenChange']>;
  finalFocus?: BaseUIDialogPopup['finalFocus'];
  children: BaseUIDialogPopup['children'];
}

export const Dialog = ({
  title,
  open,
  onOpenChange,
  finalFocus,
  children,
}: Props) => {
  const titleId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);

  return (
    <BaseUIDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseUIDialog.Portal>
        <BaseUIDialog.Backdrop className={styles.backdrop} />
        <BaseUIDialog.Popup
          className={styles.popup}
          aria-labelledby={titleId}
          finalFocus={finalFocus}
        >
          <Stack space="large">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              gap="small"
              flexGrow={1}
            >
              <Heading ref={headingRef} level="3" id={titleId}>
                {title}
              </Heading>
              <BaseUIDialog.Close
                render={
                  <ButtonIcon
                    size="small"
                    icon={<DismissIcon />}
                    label="Close"
                  />
                }
              />
            </Box>

            <>{children}</>
          </Stack>
        </BaseUIDialog.Popup>
      </BaseUIDialog.Portal>
    </BaseUIDialog.Root>
  );
};
