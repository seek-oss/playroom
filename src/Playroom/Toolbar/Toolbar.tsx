import React, { useContext, ReactChild, useEffect, useState } from 'react';
import copy from 'copy-to-clipboard';
import classnames from 'classnames';
import { PlayroomProps } from '../Playroom';
import { StoreContext, EditorPosition } from '../../StoreContext/StoreContext';
import ViewPreference from '../ViewPreference/ViewPreference';
import Snippets from '../Snippets/Snippets';
import AddSvg from './icons/AddSvg';
import WidthsSvg from './icons/WidthsSvg';
import ThemesSvg from './icons/ThemesSvg';
import ToolbarItem from '../ToolbarItem/ToolbarItem';
import EditorUndockedSvg from './icons/EditorUndockedSvg';
import EditorBottomSvg from './icons/EditorBottomSvg';
import EditorRightSvg from './icons/EditorRightSvg';
import ShareSvg from './icons/ShareSvg';

// @ts-ignore
import styles from './Toolbar.less';

interface Props {
  themes: PlayroomProps['themes'];
  widths: PlayroomProps['widths'];
  snippets: PlayroomProps['snippets'];
}

interface Icon {
  component: ReactChild;
  title: string;
}
const positionIcon: Record<EditorPosition, Icon> = {
  undocked: {
    component: <EditorUndockedSvg />,
    title: 'Undock into separate window '
  },
  right: {
    component: <EditorRightSvg />,
    title: 'Dock to right'
  },
  bottom: {
    component: <EditorBottomSvg />,
    title: 'Dock to bottom'
  }
};

export default ({ themes: allThemes, widths: allWidths, snippets }: Props) => {
  const [
    {
      visibleThemes,
      visibleWidths,
      editorPosition,
      activeToolbarPanel,
      validCursorPosition
    },
    dispatch
  ] = useContext(StoreContext);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    if (copying) {
      copy(window.location.href);
      setTimeout(() => setCopying(false), 2000);
    }
  }, [copying]);

  const isSnippetsOpen = activeToolbarPanel === 'snippets';
  const isThemeOpen = activeToolbarPanel === 'themes';
  const isWidthOpen = activeToolbarPanel === 'widths';
  const isPositionOpen = activeToolbarPanel === 'positions';
  const hasSnippets = snippets && snippets.length > 0;
  const hasThemes =
    allThemes.filter(themeName => themeName !== '__PLAYROOM__NO_THEME__')
      .length > 0;
  const isOpen = Boolean(activeToolbarPanel);

  return (
    <div
      className={classnames(styles.root, {
        [styles.isOpen]: isOpen && !isPositionOpen
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
          <div
            className={classnames(styles.topButtons, {
              [styles.topButtons_hide]: isPositionOpen
            })}
          >
            {hasSnippets && (
              <ToolbarItem
                active={isSnippetsOpen}
                title={`Insert snippet (${
                  navigator.platform.match('Mac') ? '\u2318' : 'Ctrl + '
                }K)`}
                showStatus={!validCursorPosition}
                statusMessage="Can't insert snippet at cursor"
                statusMessageTone="critical"
                data-testid="toggleSnippets"
                onClick={() =>
                  dispatch({
                    type: 'toggleToolbar',
                    payload: { panel: 'snippets' }
                  })
                }
              >
                <AddSvg />
              </ToolbarItem>
            )}
            {hasThemes && (
              <ToolbarItem
                active={isThemeOpen}
                count={visibleThemes ? visibleThemes.length : 0}
                title={
                  visibleThemes
                    ? `Showing ${visibleThemes.length} of ${allThemes.length} themes`
                    : 'Configure themes'
                }
                onClick={() =>
                  dispatch({
                    type: 'toggleToolbar',
                    payload: { panel: 'themes' }
                  })
                }
              >
                <ThemesSvg />
              </ToolbarItem>
            )}
            <ToolbarItem
              active={isWidthOpen}
              count={visibleWidths ? visibleWidths.length : 0}
              title={
                visibleWidths
                  ? `Showing ${visibleWidths.length} of ${allWidths.length} widths`
                  : 'Configure widths'
              }
              onClick={() =>
                dispatch({
                  type: 'toggleToolbar',
                  payload: { panel: 'widths' }
                })
              }
              data-testid="toggleWidths"
            >
              <WidthsSvg />
            </ToolbarItem>

            <ToolbarItem
              active={copying}
              title="Copy link to clipboard"
              statusMessage="Link copied to clipboard"
              statusMessageTone="positive"
              showStatus={copying}
              onClick={() => setCopying(true)}
              data-testid="copyToClipboard"
            >
              <ShareSvg />
            </ToolbarItem>
          </div>

          <ToolbarItem
            active={isPositionOpen}
            title="Configure editor position"
            onClick={() =>
              dispatch({
                type: 'toggleToolbar',
                payload: { panel: 'positions' }
              })
            }
          >
            {positionIcon[editorPosition].component}
          </ToolbarItem>

          <div
            className={classnames(styles.positionContainer, {
              [styles.positions_isOpen]: isPositionOpen // eslint-disable-line css-modules/no-undef-class
            })}
            onClick={() => dispatch({ type: 'closeToolbar' })}
          >
            {Object.keys(positionIcon)
              .filter(pos => pos !== editorPosition)
              .map(pos => {
                const position = pos as EditorPosition;
                return (
                  <div
                    key={position}
                    hidden={isPositionOpen ? undefined : true}
                  >
                    <ToolbarItem
                      title={positionIcon[position].title}
                      onClick={() => {
                        dispatch({
                          type: 'updateEditorPosition',
                          payload: { position }
                        });
                      }}
                    >
                      {positionIcon[position].component}
                    </ToolbarItem>
                  </div>
                );
              })}
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
                onHighlight={snippet => {
                  dispatch({
                    type: 'previewSnippet',
                    payload: { snippet }
                  });
                }}
                onClose={snippet => {
                  if (snippet) {
                    dispatch({
                      type: 'persistSnippet',
                      payload: { snippet }
                    });
                  } else {
                    dispatch({ type: 'closeToolbar' });
                  }
                }}
              />
            </div>
          )}
          {hasThemes && (
            <div
              hidden={isThemeOpen ? undefined : true}
              className={styles.preference}
            >
              <ViewPreference
                title="Themes"
                visible={visibleThemes || []}
                available={allThemes}
                onChange={newThemes => {
                  if (newThemes) {
                    dispatch({
                      type: 'updateVisibleThemes',
                      payload: { themes: newThemes }
                    });
                  } else {
                    dispatch({ type: 'resetVisibleThemes' });
                  }
                }}
                onReset={() => dispatch({ type: 'resetVisibleThemes' })}
              />
            </div>
          )}
          <div
            hidden={isWidthOpen ? undefined : true}
            className={styles.preference}
          >
            <ViewPreference
              title="Widths"
              visible={visibleWidths || []}
              available={allWidths}
              onChange={newWidths => {
                if (newWidths) {
                  dispatch({
                    type: 'updateVisibleWidths',
                    payload: { widths: newWidths }
                  });
                } else {
                  dispatch({ type: 'resetVisibleWidths' });
                }
              }}
              onReset={() => dispatch({ type: 'resetVisibleWidths' })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
