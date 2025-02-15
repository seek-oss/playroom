import { useRef, useContext, useState, useCallback, useEffect } from 'react';
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

import { CSSTransition } from 'react-transition-group';

interface Props {
  themes: PlayroomProps['themes'];
  widths: PlayroomProps['widths'];
  snippets: PlayroomProps['snippets'];
}

const ANIMATION_TIMEOUT = 300;

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
  const nodeRef = useRef(null);

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

  const [lastActivePanel, setLastActivePanel] =
    useState<typeof activeToolbarPanel>(undefined);

  useEffect(() => {
    if (activeToolbarPanel) {
      setLastActivePanel(activeToolbarPanel);
    }
  }, [activeToolbarPanel]);

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
          <div>
            {hasSnippets && (
              <ToolbarItem
                active={isSnippetsOpen}
                title={`Insert snippet (${isMac() ? '⌘K' : 'Ctrl+K'})`}
                disabled={!validCursorPosition}
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
            >
              <PlayIcon />
            </ToolbarItem>
          </div>

          <div>
            <ToolbarItem
              title="Copy Playroom link"
              success={copying}
              onClick={copyHandler}
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
        <CSSTransition
          in={isOpen}
          nodeRef={nodeRef}
          timeout={ANIMATION_TIMEOUT}
          classNames={styles.transitionStyles}
          mountOnEnter
          unmountOnExit
          onExited={() => setLastActivePanel(undefined)}
        >
          <div ref={nodeRef} className={styles.panel} id="custom-id">
            {lastActivePanel === 'snippets' && (
              <Snippets
                isOpen={isOpen}
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
            )}

            {lastActivePanel === 'frames' && (
              <FramesPanel
                availableWidths={allWidths}
                availableThemes={allThemes}
              />
            )}

            {lastActivePanel === 'preview' && (
              <PreviewPanel themes={allThemes} visibleThemes={visibleThemes} />
            )}

            {lastActivePanel === 'settings' && <SettingsPanel />}
          </div>
        </CSSTransition>
      </div>
    </div>
  );
};
