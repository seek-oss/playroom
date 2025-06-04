import type { ComponentProps } from 'react';

import type Frame from '../Frame/Frame';
import { ErrorMessage } from '../RenderError/RenderError';
import { Stack } from '../Stack/Stack';

type FrameProps = ComponentProps<typeof Frame>;

export const PreviewError: FrameProps['ErrorComponent'] = ({
  errorMessage,
}) => (
  <ErrorMessage
    size="large"
    errorMessage={
      errorMessage ? (
        <Stack space="xlarge">
          <>{errorMessage}</>
          <a href={window.location.href.replace('/preview', '')}>
            Edit Playroom
          </a>
        </Stack>
      ) : null
    }
  />
);
