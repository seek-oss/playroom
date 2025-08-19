import { useContext } from 'react';

import { StoreContext } from '../../contexts/StoreContext';
import { Heading } from '../Heading/Heading';
import { Stack } from '../Stack/Stack';
import { ToolbarPanel } from '../ToolbarPanel/ToolbarPanel';

import * as styles from './FramesPanel.css';

export default () => {
  const [{ title }, dispatch] = useContext(StoreContext);

  return (
    <ToolbarPanel>
      <label>
        <Stack space="xsmall">
          <Heading level="3">Title</Heading>
          <input
            type="text"
            id="playroomTitleField"
            placeholder="Enter a title for this Playroom..."
            className={styles.textField}
            value={title}
            onChange={(e) =>
              dispatch({
                type: 'updateTitle',
                payload: { title: e.target.value },
              })
            }
          />
        </Stack>
      </label>
    </ToolbarPanel>
  );
};
