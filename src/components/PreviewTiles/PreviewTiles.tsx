import { assignInlineVars } from '@vanilla-extract/dynamic';
import { FolderOpen, Trash } from 'lucide-react';
import { type RefObject, useContext, useMemo, useRef, useState } from 'react';

import { decompressParams } from '../../../utils';
import { StoreContext } from '../../contexts/StoreContext';
import { compileJsx } from '../../utils/compileJsx';
import { Box } from '../Box/Box';
import { Button } from '../Button/Button';
import { ContextMenu, ContextMenuItem } from '../ContextMenu/ContextMenu';
import { Dialog } from '../Dialog/Dialog';
import Iframe from '../Frames/Iframe';
import frameSrc from '../Frames/frameSrc';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';
import { Tooltip } from '../Tooltip/Tooltip';

import * as styles from './PreviewTiles.css';

const scale = 0.15;
export const PreviewTiles = ({
  onSelect,
  scrollingRef,
}: {
  onSelect: () => void;
  scrollingRef: RefObject<HTMLDivElement | null>;
}) => {
  const [{ selectedThemes, storedPlayrooms }, dispatch] =
    useContext(StoreContext);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const playroomEntries = useMemo(
    () =>
      Object.entries(storedPlayrooms).map(([id, storedPlayroom]) => {
        const params = decompressParams(storedPlayroom.dataParam);
        const {
          themes = [],
          widths = [],
          title = '',
          code = '',
          editorHidden,
        } = params;
        const themeName = themes?.length === 1 ? themes[0] : selectedThemes[0];

        return {
          id,
          code,
          title,
          themes,
          widths,
          themeName,
          editorHidden,
        };
      }),
    [storedPlayrooms, selectedThemes]
  );

  return playroomEntries.length === 0 ? (
    <Stack space="large">
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
        {playroomEntries.map(
          ({ id, code, themes, widths, themeName, title, editorHidden }) => (
            <ContextMenu
              key={id}
              trigger={
                <li
                  className={styles.tile}
                  style={assignInlineVars({
                    [styles.scaleVar]: `${scale}`,
                  })}
                >
                  <Iframe
                    tabIndex={-1}
                    className={styles.iframe}
                    src={frameSrc({ themeName, code: compileJsx(code) })}
                    intersectionRootRef={scrollingRef}
                  />
                  <span className={styles.titleContainer}>
                    <Text truncate>{title || 'Untitled Playroom'}</Text>
                  </span>
                  <Tooltip
                    label={`Open “${title || 'Untitled Playroom'}”`}
                    delay={500}
                    side="bottom"
                    trigger={
                      <button
                        className={styles.button}
                        aria-label={`Open “${title || 'Untitled Playroom'}”`}
                        onClick={() => {
                          dispatch({
                            type: 'openPlayroom',
                            payload: {
                              id,
                              code,
                              title,
                              themes,
                              widths,
                              editorHidden,
                            },
                          });
                          onSelect();
                        }}
                      />
                    }
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
                      id,
                      code,
                      title,
                      themes,
                      widths,
                      editorHidden,
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
          )
        )}
      </ul>
      <Dialog
        title="Confirm delete"
        open={Boolean(confirmDeleteId)}
        onOpenChange={() => setConfirmDeleteId(null)}
        finalFocus={listRef}
      >
        <Stack space="xlarge">
          <Text>Are you sure you want to delete this playroom?</Text>
          <Box display="flex" gap="small">
            <Button size="large" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button
              tone="critical"
              size="large"
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
        </Stack>
      </Dialog>
    </>
  );
};
