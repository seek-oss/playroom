import { useContext, useState, useCallback } from 'react';
import { useTimeoutFn } from 'react-use';
import classnames from 'classnames';
import type { PlayroomProps } from '../Playroom';
import { StoreContext } from '../../StoreContext/StoreContext';
import FramesPanel from '../FramesPanel/FramesPanel';
import PreviewPanel from '../PreviewPanel/PreviewPanel';
import Snippets from '../Snippets/Snippets';
import ToolbarItem from '../ToolbarItem/ToolbarItem';
import AddIcon from '../icons/AddIcon';
import FramesIcon from '../icons/FramesIcon';
import ShareIcon from '../icons/ShareIcon';
import PlayIcon from '../icons/PlayIcon';

import * as styles from './Toolbar.css';
import SettingsPanel from '../SettingsPanel/SettingsPanel';
import SettingsIcon from '../icons/SettingsIcon';
import { isMac } from '../../utils/formatting';

interface Props {
  themes: PlayroomProps['themes'];
  widths: PlayroomProps['widths'];
  snippets: PlayroomProps['snippets'];
}

export const toolbarItemCount = 5;

export default ({ themes: allThemes, widths: allWidths, snippets }: Props) => {
  const [
    {
      visibleThemes = [],
      visibleWidths = [],
      activeToolbarPanel,
      validCursorPosition,
      code,
    },
    dispatch,
  ] = useContext(StoreContext);
  const [copying, setCopying] = useState(false);
  const [isReady, cancel, reset] = useTimeoutFn(() => setCopying(false), 3000);

  const copyHandler = useCallback(() => {
    dispatch({
      type: 'copyToClipboard',
      payload: { url: window.location.href, trigger: 'toolbarItem' },
    });
    setCopying(true);

    if (isReady() === false) {
      cancel();
    }

    reset();
  }, [cancel, dispatch, isReady, reset]);

  const isSnippetsOpen = activeToolbarPanel === 'snippets';
  const isFramesOpen = activeToolbarPanel === 'frames';
  const isSettingsOpen = activeToolbarPanel === 'settings';
  const isPreviewOpen = activeToolbarPanel === 'preview';

  const hasSnippets = snippets && snippets.length > 0;
  const hasFilteredFrames =
    visibleThemes.length > 0 || visibleWidths.length > 0;
  const isOpen = Boolean(activeToolbarPanel);

  return (
    <div
      className={classnames(styles.root, {
        [styles.isOpen]: isOpen,
      })}
    >
      {isOpen && (
        <div
          className={styles.backdrop}
          onClick={() => dispatch({ type: 'closeToolbar' })}
        />
      )}
      <div className={styles.sidebar}>
        <div className={styles.buttons}>
          <div className={styles.topButtons}>
            {hasSnippets && (
              <ToolbarItem
                active={isSnippetsOpen}
                title={`Insert snippet (${isMac() ? '⌘K' : 'Ctrl+K'})`}
                disabled={!validCursorPosition}
                data-testid="toggleSnippets"
                onClick={() => {
                  dispatch({
                    type: 'toggleToolbar',
                    payload: { panel: 'snippets' },
                  });
                }}
              >
                <AddIcon />
              </ToolbarItem>
            )}
            <ToolbarItem
              active={isFramesOpen}
              showIndicator={hasFilteredFrames}
              title="Configure visible frames"
              onClick={() => {
                dispatch({
                  type: 'toggleToolbar',
                  payload: { panel: 'frames' },
                });
              }}
              data-testid="toggleFrames"
            >
              <FramesIcon />
            </ToolbarItem>

            <ToolbarItem
              active={isPreviewOpen}
              title="Preview playroom"
              disabled={code.trim().length === 0}
              onClick={() => {
                dispatch({
                  type: 'toggleToolbar',
                  payload: { panel: 'preview' },
                });
              }}
              data-testid="togglePreview"
            >
              <PlayIcon />
            </ToolbarItem>
          </div>

          <div>
            <ToolbarItem
              title={`Copy Playroom link (${isMac() ? '⌘⇧C' : 'Ctrl+Shift+C'})`}
              success={copying}
              onClick={copyHandler}
              data-testid="copyToClipboard"
            >
              <ShareIcon />
            </ToolbarItem>
            <ToolbarItem
              active={isSettingsOpen}
              title="Edit settings"
              onClick={() =>
                dispatch({
                  type: 'toggleToolbar',
                  payload: { panel: 'settings' },
                })
              }
            >
              <SettingsIcon />
            </ToolbarItem>
          </div>
        </div>

        <div className={styles.panel}>
          {isSnippetsOpen && (
            <div
              hidden={isSnippetsOpen ? undefined : true}
              className={styles.preference}
            >
              <Snippets
                snippets={snippets}
                onHighlight={(snippet) => {
                  dispatch({
                    type: 'previewSnippet',
                    payload: { snippet },
                  });
                }}
                onClose={(snippet) => {
                  if (snippet) {
                    dispatch({
                      type: 'persistSnippet',
                      payload: { snippet },
                    });
                  } else {
                    dispatch({ type: 'closeToolbar' });
                  }
                }}
              />
            </div>
          )}
          <div
            hidden={isFramesOpen ? undefined : true}
            className={styles.preference}
          >
            <FramesPanel
              availableWidths={allWidths}
              availableThemes={allThemes}
            />
          </div>

          <div
            hidden={isPreviewOpen ? undefined : true}
            className={styles.preference}
          >
            <PreviewPanel themes={allThemes} visibleThemes={visibleThemes} />
          </div>

          <div
            hidden={isSettingsOpen ? undefined : true}
            className={styles.preference}
          >
            <SettingsPanel />
          </div>
        </div>
      </div>
    </div>
  );
};
