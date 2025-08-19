import clsx from 'clsx';
import { useContext, useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

import snippets from '../../configModules/snippets';
import { StoreContext } from '../../contexts/StoreContext';
import { isMac } from '../../utils/formatting';
import FramesPanel from '../FramesPanel/FramesPanel';
import Snippets from '../Snippets/Snippets';
import ToolbarItem from '../ToolbarItem/ToolbarItem';
import { ANIMATION_DURATION_SLOW } from '../constants';
import AddIcon from '../icons/AddIcon';
import FramesIcon from '../icons/FramesIcon';

import * as styles from './Toolbar.css';

export default () => {
  const [
    {
      visibleThemes = [],
      visibleWidths = [],
      activeToolbarPanel,
      validCursorPosition,
    },
    dispatch,
  ] = useContext(StoreContext);
  const isSnippetsOpen = activeToolbarPanel === 'snippets';
  const isFramesOpen = activeToolbarPanel === 'frames';

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
    <div
      className={clsx(styles.root, {
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
          </div>
        </div>
        <CSSTransition
          in={isOpen}
          nodeRef={panelRef}
          timeout={ANIMATION_DURATION_SLOW}
          classNames={styles.transitionStyles}
          mountOnEnter
          unmountOnExit
          onExited={() => setLastActivePanel(undefined)}
        >
          <div className={styles.panel} id="custom-id" ref={panelRef}>
            {lastActivePanel === 'snippets' && (
              <Snippets
                isOpen={isOpen}
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

            {lastActivePanel === 'frames' && <FramesPanel />}
          </div>
        </CSSTransition>
      </div>
    </div>
  );
};
