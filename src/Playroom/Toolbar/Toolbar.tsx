import { useContext, useState, useCallback, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

import { StoreContext } from '../../StoreContext/StoreContext';
import { isMac } from '../../utils/formatting';
import { Box } from '../Box/Box';
import { FramesPanel } from '../FramesPanel/FramesPanel';
import type { PlayroomProps } from '../Playroom';
import PreviewPanel from '../PreviewPanel/PreviewPanel';
import SettingsPanel from '../SettingsPanel/SettingsPanel';
import Snippets from '../Snippets/Snippets';
import ToolbarItem from '../ToolbarItem/ToolbarItem';
import AddIcon from '../icons/AddIcon';
import FramesIcon from '../icons/FramesIcon';
import PlayIcon from '../icons/PlayIcon';
import SettingsIcon from '../icons/SettingsIcon';
import ShareIcon from '../icons/ShareIcon';

import * as styles from './Toolbar.css';

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

  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <Box position="relative">
      <Box
        position="absolute"
        inset={0}
        boxShadow="small"
        className={styles.shadow}
      />

      <Box
        position="relative"
        height="full"
        display="flex"
        zIndex={1}
        className={styles.root}
      >
        {isOpen && (
          <div
            className={styles.backdrop}
            onClick={() => dispatch({ type: 'closeToolbar' })}
          />
        )}
        <div className={styles.sidebar}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            pointerEvents="auto"
            justifyContent="space-between"
            position="relative"
            zIndex={1}
            className={styles.buttons}
          >
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
          </Box>
          <CSSTransition
            in={isOpen}
            nodeRef={panelRef}
            timeout={ANIMATION_TIMEOUT}
            classNames={styles.transitionStyles}
            mountOnEnter
            unmountOnExit
            onExited={() => setLastActivePanel(undefined)}
          >
            <div className={styles.panel} id="custom-id" ref={panelRef}>
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
                <PreviewPanel
                  themes={allThemes}
                  visibleThemes={visibleThemes}
                />
              )}
              {lastActivePanel === 'settings' && <SettingsPanel />}
            </div>
          </CSSTransition>
        </div>
      </Box>
    </Box>
  );
};

// copied directly from `react-use`
// https://github.com/streamich/react-use/blob/db07ab65bfa48a399e7fd83f172653eb342882b1/src/useTimeoutFn.ts#L3-L40
type UseTimeoutFnReturn = [() => boolean | null, () => void, () => void];

function useTimeoutFn<T extends () => void>(
  fn: T,
  ms: number = 0
): UseTimeoutFnReturn {
  const ready = useRef<boolean | null>(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const callback = useRef(fn);

  const isReady = useCallback(() => ready.current, []);

  const set = useCallback(() => {
    ready.current = false;
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => {
      ready.current = true;
      callback.current();
    }, ms);
  }, [ms]);

  const clear = useCallback(() => {
    ready.current = null;
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  }, []);

  // update ref when function changes
  useEffect(() => {
    callback.current = fn;
  }, [fn]);

  // set on mount, clear on unmount
  useEffect(() => {
    set();

    return clear;
    // disabled in the original implementation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ms]);

  return [isReady, clear, set];
}
