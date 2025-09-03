import { assignInlineVars } from '@vanilla-extract/dynamic';
import { FolderOpen, Trash } from 'lucide-react';
import { useContext, useMemo, useRef, useState } from 'react';

import { decompressParams } from '../../../utils';
import { StoreContext } from '../../contexts/StoreContext';
import { compileJsx } from '../../utils/compileJsx';
import { Box } from '../Box/Box';
import { Button } from '../Button/Button';
import { ContextMenu, ContextMenuItem } from '../ContextMenu/ContextMenu';
import { Dialog } from '../Dialog/Dialog';
import frameSrc from '../Frames/frameSrc';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';

import * as styles from './PreviewTiles.css';

const scale = 0.5;
export const PreviewTiles = ({ onSelect }: { onSelect: () => void }) => {
  const [{ selectedThemes, storedPlayrooms }, dispatch] =
    useContext(StoreContext);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const sortedPlayroomEntries = useMemo(
    () =>
      Object.entries(storedPlayrooms)
        .sort(
          ([, { lastModifiedDate: aDate }], [, { lastModifiedDate: bDate }]) =>
            bDate.getTime() - aDate.getTime()
        )
        .map(([id, storedPlayroom]) => {
          const params = decompressParams(storedPlayroom.dataParam);
          const { themes, code = '' } = params;
          const themeName =
            themes?.length === 1 ? themes[0] : selectedThemes[0];

          return {
            id,
            code,
            params,
            themeName,
          };
        }),
    [storedPlayrooms, selectedThemes]
  );

  return sortedPlayroomEntries.length === 0 ? (
    <Stack space="medium">
      <Text size="large">No saved Playrooms available.</Text>
      <Text size="large">
        Playrooms are automatically saved and stored locally in your browser.
        <br />
        Once you start creating, return here to retrieve a previous design.
      </Text>
    </Stack>
  ) : (
    <>
      <ul ref={listRef} tabIndex={-1} className={styles.tiles}>
        {sortedPlayroomEntries.map(({ id, params, code, themeName }) => (
          <ContextMenu
            key={id}
            trigger={
              <li
                className={styles.tile}
                style={assignInlineVars({
                  [styles.scaleVar]: `${scale}`,
                })}
              >
                <iframe
                  tabIndex={-1}
                  className={styles.iframe}
                  src={frameSrc({ themeName, code: compileJsx(code) })}
                />
                <span className={styles.titleContainer}>
                  <Text truncate>{params.title || 'Untitled Playroom'}</Text>
                </span>
                <button
                  className={styles.button}
                  onClick={() => {
                    dispatch({
                      type: 'openPlayroom',
                      payload: {
                        ...params,
                        id,
                        code,
                      },
                    });
                    onSelect();
                  }}
                />
              </li>
            }
          >
            <ContextMenuItem
              icon={FolderOpen}
              onClick={() => {
                dispatch({
                  type: 'openPlayroom',
                  payload: {
                    ...params,
                    id,
                    code,
                  },
                });
                onSelect();
              }}
            >
              Open
            </ContextMenuItem>
            <ContextMenuItem
              icon={Trash}
              tone="critical"
              onClick={() => setConfirmDeleteId(id)}
            >
              Delete
            </ContextMenuItem>
          </ContextMenu>
        ))}
      </ul>
      <Dialog
        title="Confirm delete"
        open={Boolean(confirmDeleteId)}
        onOpenChange={() => setConfirmDeleteId(null)}
        finalFocus={listRef}
      >
        <Text>Are you sure you want to delete this playroom?</Text>
        <Box display="flex" gap="small">
          <Button onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
          <Button
            tone="critical"
            onClick={() => {
              if (confirmDeleteId) {
                dispatch({
                  type: 'deletePlayroom',
                  payload: {
                    id: confirmDeleteId,
                  },
                });
              }
              setConfirmDeleteId(null);
            }}
          >
            Delete
          </Button>
        </Box>
      </Dialog>
    </>
  );
};
