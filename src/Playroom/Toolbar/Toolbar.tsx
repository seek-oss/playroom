import React, { useContext, ReactChild, useState, useCallback } from 'react';
import { useTimeoutFn } from 'react-use';
import classnames from 'classnames';
import { PlayroomProps } from '../Playroom';
import { StoreContext, EditorPosition } from '../../StoreContext/StoreContext';
import FramesPanel from '../FramesPanel/FramesPanel';
import PreviewPanel from '../PreviewPanel/PreviewPanel';
import Snippets from '../Snippets/Snippets';
import ToolbarItem from '../ToolbarItem/ToolbarItem';
import AddIcon from '../icons/AddIcon';
import FramesIcon from '../icons/FramesIcon';
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
    title: 'Undock into separate window ',
  },
  right: {
    component: <EditorRightIcon />,
    title: 'Dock to right',
  },
  bottom: {
    component: <EditorBottomIcon />,
    title: 'Dock to bottom',
  },
};

export default ({ themes: allThemes, widths: allWidths, snippets }: Props) => {
  const [
    {
      visibleThemes = [],
      visibleWidths = [],
      editorPosition,
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
  const isPositionOpen = activeToolbarPanel === 'positions';
  const isPreviewOpen = activeToolbarPanel === 'preview';

  const hasSnippets = snippets && snippets.length > 0;
  const hasFilteredFrames =
    visibleThemes.length > 0 || visibleWidths.length > 0;
  const isOpen = Boolean(activeToolbarPanel);

  return (
    <div
      className={classnames(styles.root, {
        [styles.isOpen]: isOpen && !isPositionOpen,
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
              [styles.topButtons_hide]: isPositionOpen,
            })}
          >
            {hasSnippets && (
              <ToolbarItem
                active={isSnippetsOpen}
                title={`Insert snippet (${
                  navigator.platform.match('Mac') ? '\u2318' : 'Ctrl + '
                }K)`}
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
              title="Copy link to clipboard"
              success={copying}
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
                  payload: { panel: 'positions' },
                })
              }
            >
              {positionIcon[editorPosition].component}
            </ToolbarItem>
          </div>

          <div
            className={classnames(styles.positionContainer, {
              [styles.positions_isOpen]: isPositionOpen, // eslint-disable-line css-modules/no-undef-class
            })}
            onClick={() => dispatch({ type: 'closeToolbar' })}
          >
            {Object.keys(positionIcon)
              .filter((pos) => pos !== editorPosition)
              .map((pos) => {
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
                          payload: { position },
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
        </div>
      </div>
    </div>
  );
};
