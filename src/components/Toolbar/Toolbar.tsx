import clsx from 'clsx';
import { useContext, useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

import snippets from '../../configModules/snippets';
import { StoreContext } from '../../contexts/StoreContext';
import { isMac } from '../../utils/formatting';
import Snippets from '../Snippets/Snippets';
import ToolbarItem from '../ToolbarItem/ToolbarItem';
import { ANIMATION_DURATION_SLOW } from '../constants';
import AddIcon from '../icons/AddIcon';

import * as styles from './Toolbar.css';

export default () => {
  const [{ activeToolbarPanel, validCursorPosition }, dispatch] =
    useContext(StoreContext);
  const isSnippetsOpen = activeToolbarPanel === 'snippets';

  const [lastActivePanel, setLastActivePanel] =
    useState<typeof activeToolbarPanel>(undefined);

  useEffect(() => {
    if (activeToolbarPanel) {
      setLastActivePanel(activeToolbarPanel);
    }
  }, [activeToolbarPanel]);

  const hasSnippets = snippets && snippets.length > 0;
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
          </div>
        </CSSTransition>
      </div>
    </div>
  );
};
