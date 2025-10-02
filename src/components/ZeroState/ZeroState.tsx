import snippets from '__PLAYROOM_ALIAS__SNIPPETS__';
import { FolderOpen, BetweenHorizontalStart } from 'lucide-react';
import { useContext, useMemo } from 'react';

import { decompressParams } from '../../../utils';
import { StoreContext } from '../../contexts/StoreContext';
import { formatAsRelative } from '../../utils/formatAsRelative';
import { Button } from '../Button/Button';
import { primaryMod } from '../CodeEditor/editorCommands';
import { Inline } from '../Inline/Inline';
import { KeyboardShortcut } from '../KeyboardShortcut/KeyboardShortcut';
import { Logo } from '../Logo/Logo';
import { Secondary } from '../Secondary/Secondary';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';

import * as styles from './ZeroState.css';

export const ZeroState = () => {
  const hasSnippets = snippets && snippets.length > 0;
  const [{ storedPlayrooms }, dispatch] = useContext(StoreContext);

  const playroomEntries = useMemo(
    () =>
      Object.entries(storedPlayrooms).map(([id, storedPlayroom]) => {
        const params = decompressParams(storedPlayroom.dataParam);
        const { title, code = '' } = params;

        return {
          id,
          code,
          params,
          title: title || 'Untitled Playroom',
          lastModified: formatAsRelative(storedPlayroom.lastModifiedDate),
        };
      }),
    [storedPlayrooms]
  );

  const hasStoredPlayrooms = playroomEntries.length > 0;

  return (
    <div className={styles.root}>
      <div className={styles.maxWidth}>
        <Stack space="xxxlarge">
          <Text size="large">
            <Logo size={36} wordmark />
          </Text>

          {hasStoredPlayrooms || hasSnippets ? (
            <Inline space="large">
              {hasStoredPlayrooms ? (
                <Button
                  onClick={() => dispatch({ type: 'openPlayroomDialog' })}
                >
                  <Stack space="xsmall">
                    <FolderOpen size={20} />
                    <Inline space="xsmall">
                      <span>Open Playroom </span>
                      <Secondary>
                        <KeyboardShortcut shortcut={[primaryMod, 'O']} />
                      </Secondary>
                    </Inline>
                  </Stack>
                </Button>
              ) : null}
              {hasSnippets ? (
                <Button onClick={() => dispatch({ type: 'openSnippets' })}>
                  <Stack space="xsmall">
                    <BetweenHorizontalStart size={20} />
                    <Inline space="xsmall">
                      <span>Insert snippet</span>
                      <Secondary>
                        <KeyboardShortcut shortcut={[primaryMod, 'K']} />
                      </Secondary>
                    </Inline>
                  </Stack>
                </Button>
              ) : null}
            </Inline>
          ) : null}

          {hasStoredPlayrooms ? (
            <Stack space="large">
              <div className={styles.recentTitleSpread}>
                <Text size="large" weight="strong" as="h3">
                  Recent Playrooms
                </Text>
                {playroomEntries.length > 5 ? (
                  <button
                    className={styles.textButton}
                    onClick={() => dispatch({ type: 'openPlayroomDialog' })}
                  >
                    <Text underline>View all ({playroomEntries.length})</Text>
                  </button>
                ) : null}
              </div>
              <Stack space="xlarge">
                {playroomEntries
                  .slice(0, 5)
                  .map(({ id, params, code, title, lastModified }) => (
                    <button
                      key={id}
                      className={styles.textButton}
                      onClick={() =>
                        dispatch({
                          type: 'openPlayroom',
                          payload: {
                            ...params,
                            id,
                            code,
                            title,
                          },
                        })
                      }
                    >
                      <Text underline>{title}</Text>
                      <Text tone="secondary" size="small">
                        {lastModified}
                      </Text>
                    </button>
                  ))}
              </Stack>
            </Stack>
          ) : null}

          <Text size="large">
            {hasStoredPlayrooms || hasSnippets
              ? '...or just start coding'
              : 'Start designing with code'}
          </Text>
        </Stack>
      </div>
    </div>
  );
};
