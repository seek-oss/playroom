import type { ComponentProps } from 'react';

import type Frame from '../Frame/Frame';
import { FrameError } from '../Frame/FrameError';
import { Stack } from '../Stack/Stack';

type FrameProps = ComponentProps<typeof Frame>;

export const PreviewError: FrameProps['ErrorComponent'] = ({ message }) => (
  <FrameError
    size="large"
    message={
      message ? (
        <Stack space="medium">
          <>{message}</>
          <a href={window.location.href.replace('/preview', '')}>
            Edit Playroom
          </a>
        </Stack>
      ) : null
    }
  />
);
