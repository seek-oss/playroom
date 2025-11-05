import { assignInlineVars } from '@vanilla-extract/dynamic';
import {
  ExternalLink,
  FolderOpen,
  LayoutGrid,
  Link,
  List,
  Trash,
} from 'lucide-react';
import {
  type ComponentProps,
  type RefObject,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

import { createUrl, decompressParams } from '../../../utils';
import playroomConfig from '../../config';
import { StoreContext } from '../../contexts/StoreContext';
import { compileJsx } from '../../utils/compileJsx';
import { formatAsRelative } from '../../utils/formatAsRelative';
import { useCopy } from '../../utils/useCopy';
import { Box } from '../Box/Box';
import { Button } from '../Button/Button';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuItemLink,
} from '../ContextMenu/ContextMenu';
import { Dialog } from '../Dialog/Dialog';
import Iframe from '../Frames/Iframe';
import frameSrc from '../Frames/frameSrc';
import { ScrollContainer } from '../ScrollContainer/ScrollContainer';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';
import { Tooltip } from '../Tooltip/Tooltip';

import * as styles from './PreviewTiles.css';

const scale = 0.15;

const getBaseUrl = () =>
  window.location.href
    .split(playroomConfig.paramType === 'hash' ? '#' : '?')[0]
    .split('index.html')[0];

const PreviewTileContextMenu = ({
  trigger,
  playroomUrl,
  onOpen,
  onDelete,
}: {
  trigger: ComponentProps<typeof ContextMenu>['trigger'];
  playroomUrl: string;
  onOpen: () => void;
  onDelete: () => void;
}) => {
  const { copying, onCopyClick } = useCopy();

  return (
    <ContextMenu trigger={trigger}>
      <ContextMenuItem icon={FolderOpen} onClick={onOpen}>
        Open
      </ContextMenuItem>
      <ContextMenuItem
        icon={!copying ? Link : undefined}
        closeOnClick={false}
        onClick={() => onCopyClick(playroomUrl)}
        tone={copying ? 'positive' : 'neutral'}
        active={!copying}
      >
        {copying ? 'Copied!' : 'Copy link'}
      </ContextMenuItem>
      <ContextMenuItemLink icon={ExternalLink} href={playroomUrl}>
        Open in new tab
      </ContextMenuItemLink>
      <ContextMenuItem icon={Trash} tone="critical" onClick={onDelete}>
        Delete
      </ContextMenuItem>
    </ContextMenu>
  );
};

export const PreviewTiles = ({
  onSelect,
  scrollingRef,
}: {
  onSelect: () => void;
  scrollingRef: RefObject<HTMLDivElement | null>;
}) => {
  const [{ selectedThemes, storedPlayrooms, openLayout }, dispatch] =
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
          lastModifiedDate: storedPlayroom.lastModifiedDate,
        };
      }),
    [storedPlayrooms, selectedThemes]
  );

  return (
    <div className={styles.container}>
      {playroomEntries.length === 0 ? (
        <Stack space="large">
          <Text size="large">No saved Playrooms available.</Text>
          <Text size="large">
            Playrooms are automatically saved and stored locally in your
            browser.
            <br />
            Once you start creating, return here to retrieve a previous design.
          </Text>
        </Stack>
      ) : (
        <>
          <Box display="flex" justifyContent="flex-end" marginBottom="medium">
            <Box display="flex" gap="xsmall">
              <ButtonIcon
                size="small"
                icon={<LayoutGrid />}
                label="Grid view"
                variant={openLayout === 'grid' ? 'solid' : 'transparent'}
                onClick={() =>
                  dispatch({
                    type: 'updateOpenLayout',
                    payload: { layout: 'grid' },
                  })
                }
              />
              <ButtonIcon
                size="small"
                icon={<List />}
                label="List view"
                variant={openLayout === 'list' ? 'solid' : 'transparent'}
                onClick={() =>
                  dispatch({
                    type: 'updateOpenLayout',
                    payload: { layout: 'list' },
                  })
                }
              />
            </Box>
          </Box>
          <ScrollContainer direction="vertical" fadeSize="medium">
            <ul
              ref={listRef}
              tabIndex={-1}
              className={openLayout === 'grid' ? styles.grid : styles.list}
              aria-label="Stored Playrooms"
            >
              {playroomEntries.map(
                ({
                  id,
                  code,
                  themes,
                  widths,
                  themeName,
                  title,
                  editorHidden,
                  lastModifiedDate,
                }) => {
                  const playroomUrl = createUrl({
                    baseUrl: getBaseUrl(),
                    code,
                    themes,
                    widths,
                    title,
                    editorHidden,
                    paramType: playroomConfig.paramType,
                  });

                  const handleOpen = (event?: React.MouseEvent) => {
                    const isCmdOrCtrl = event?.metaKey || event?.ctrlKey;

                    if (isCmdOrCtrl) {
                      window.open(playroomUrl, '_blank');
                    } else {
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
                    }
                  };

                  const displayTitle = title || 'Untitled Playroom';
                  const ariaLabel = `Open "${displayTitle}"`;

                  const trigger =
                    openLayout === 'list' ? (
                      <li className={styles.listItem}>
                        <button
                          className={styles.listItemButton}
                          aria-label={ariaLabel}
                          onClick={handleOpen}
                        >
                          <Stack space="xsmall">
                            <Text truncate weight="strong">
                              {displayTitle}
                            </Text>
                            <Text tone="secondary" size="small">
                              {formatAsRelative(new Date(lastModifiedDate))}
                            </Text>
                          </Stack>
                        </button>
                      </li>
                    ) : (
                      <li
                        className={styles.gridItem}
                        style={assignInlineVars({
                          [styles.scaleVar]: `${scale}`,
                        })}
                      >
                        <Iframe
                          tabIndex={-1}
                          className={styles.gridItemIframe}
                          src={frameSrc({ themeName, code: compileJsx(code) })}
                          intersectionRootRef={scrollingRef}
                        />
                        <span className={styles.gridItemTitle}>
                          <Text truncate>{displayTitle}</Text>
                        </span>
                        <Tooltip
                          delay
                          label={displayTitle}
                          side="bottom"
                          trigger={
                            <button
                              className={styles.gridItemButton}
                              aria-label={ariaLabel}
                              onClick={handleOpen}
                            />
                          }
                        />
                      </li>
                    );

                  return (
                    <PreviewTileContextMenu
                      key={id}
                      trigger={trigger}
                      playroomUrl={playroomUrl}
                      onOpen={handleOpen}
                      onDelete={() => setConfirmDeleteId(id)}
                    />
                  );
                }
              )}
            </ul>
          </ScrollContainer>
        </>
      )}
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
    </div>
  );
};
