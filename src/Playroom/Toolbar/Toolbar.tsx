import React, { useContext, ReactChild, useState, useCallback } from 'react';
import { useTimeoutFn } from 'react-use';
import copy from 'copy-to-clipboard';
import classnames from 'classnames';
import { PlayroomProps } from '../Playroom';
import { StoreContext, EditorPosition } from '../../StoreContext/StoreContext';
import ViewPreference from '../ViewPreference/ViewPreference';
import PreviewPanel from '../PreviewPanel/PreviewPanel';
import Snippets from '../Snippets/Snippets';
import ToolbarItem from '../ToolbarItem/ToolbarItem';
import AddIcon from '../icons/AddIcon';
import WidthsIcon from '../icons/WidthsIcon';
import ThemesIcon from '../icons/ThemesIcon';
import EditorUndockedIcon from '../icons/EditorUndockedIcon';
import EditorBottomIcon from '../icons/EditorBottomIcon';
import EditorRightIcon from '../icons/EditorRightIcon';
import ShareIcon from '../icons/ShareIcon';
import PlayIcon from '../icons/PlayIcon';

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
    component: <EditorUndockedIcon />,
    title: 'Undock into separate window '
  },
  right: {
    component: <EditorRightIcon />,
    title: 'Dock to right'
  },
  bottom: {
    component: <EditorBottomIcon />,
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
      validCursorPosition,
      code
    },
    dispatch
  ] = useContext(StoreContext);
  const [copying, setCopying] = useState(false);
  const [isReady, cancel, reset] = useTimeoutFn(() => setCopying(false), 2000);

  const copyHandler = useCallback(() => {
    copy(window.location.href);
    dispatch({ type: 'closeToolbar' });
    setCopying(true);

    if (isReady() === false) {
      cancel();
    }

    reset();
  }, [cancel, dispatch, isReady, reset]);

  const isSnippetsOpen = activeToolbarPanel === 'snippets';
  const isThemeOpen = activeToolbarPanel === 'themes';
  const isWidthOpen = activeToolbarPanel === 'widths';
  const isPositionOpen = activeToolbarPanel === 'positions';
  const isPreviewOpen = activeToolbarPanel === 'preview';

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
                showStatus={
                  !copying && !validCursorPosition && !activeToolbarPanel
                }
                statusMessage="Can't insert snippet at cursor"
                statusMessageTone="critical"
                data-testid="toggleSnippets"
                onClick={() => {
                  dispatch({
                    type: 'toggleToolbar',
                    payload: { panel: 'snippets' }
                  });
                }}
              >
                <AddIcon />
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
                onClick={() => {
                  dispatch({
                    type: 'toggleToolbar',
                    payload: { panel: 'themes' }
                  });
                }}
              >
                <ThemesIcon />
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
              onClick={() => {
                dispatch({
                  type: 'toggleToolbar',
                  payload: { panel: 'widths' }
                });
              }}
              data-testid="toggleWidths"
            >
              <WidthsIcon />
            </ToolbarItem>

            <ToolbarItem
              active={isPreviewOpen}
              title="Preview playroom"
              showStatus={code.trim().length > 0}
              statusMessage="Nothing to preview"
              statusMessageTone="critical"
              onClick={() =>
                dispatch({
                  type: 'toggleToolbar',
                  payload: { panel: 'preview' }
                })
              }
              data-testid="togglePreview"
            >
              <PlayIcon />
            </ToolbarItem>
          </div>

          <div>
            <ToolbarItem
              active={copying && !activeToolbarPanel}
              title="Copy link to clipboard"
              statusMessage="Link copied to clipboard"
              statusMessageTone="positive"
              showStatus={copying && !activeToolbarPanel}
              onClick={copyHandler}
              data-testid="copyToClipboard"
            >
              <ShareIcon />
            </ToolbarItem>
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
          </div>

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
                return position === 'undocked' ? null : (
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

          <div
            hidden={isPreviewOpen ? undefined : true}
            className={styles.preference}
          >
            <PreviewPanel themes={allThemes} visibleThemes={visibleThemes} />
          </div>
        </div>
      </div>
    </div>
  );
};
