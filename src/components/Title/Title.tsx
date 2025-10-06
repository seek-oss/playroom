import { useContext } from 'react';

import { StoreContext } from '../../contexts/StoreContext';
import { Text } from '../Text/Text';

import * as styles from './Title.css';

export const Title = () => {
  const [{ title }, dispatch] = useContext(StoreContext);

  return (
    <div className={styles.fieldContainer}>
      <input
        type="text"
        aria-label="Playroom Title"
        placeholder="Untitled"
        className={styles.textField}
        value={title || ''}
        onFocus={(event) => event.currentTarget.focus()}
        onChange={(e) =>
          dispatch({
            type: 'updateTitle',
            payload: { title: e.target.value },
          })
        }
      />
      <span aria-hidden className={styles.readOnlyText}>
        <Text
          weight={styles.titleWeight}
          size={styles.titleSize}
          tone={!title ? 'secondary' : undefined}
          align="center"
          truncate
        >
          <span className={styles.preserveWhiteSpace}>
            {title || 'Untitled'}
          </span>
        </Text>
      </span>
    </div>
  );
};
