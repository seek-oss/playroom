import {
  useContext,
  type ComponentType,
  Fragment,
  useState,
  useCallback,
} from 'react';
import { Helmet } from 'react-helmet';
import classnames from 'classnames';
import { useDebouncedCallback } from 'use-debounce';
import { Resizable } from 're-resizable';
import Frames from './Frames/Frames';
import { WindowPortal } from './WindowPortal';
import type { Snippets } from '../../utils';
import componentsToHints from '../utils/componentsToHints';
import Toolbar, { useTimeoutFn } from './Toolbar/Toolbar';
import ChevronIcon from './icons/ChevronIcon';
import { StatusMessage } from './StatusMessage/StatusMessage';
import {
  StoreContext,
  type EditorPosition,
} from '../StoreContext/StoreContext';

import { CodeEditor } from './CodeEditor/CodeEditor';

import * as styles from './Playroom.css';
import { Box } from './Box/Box';

import { assignInlineVars } from '@vanilla-extract/dynamic';
import { Text } from './Text/Text';
import EditorBottomIcon from './icons/EditorBottomIcon';
import EditorRightIcon from './icons/EditorRightIcon';
import ShareIcon from './icons/ShareIcon';
import PlayIcon from './icons/PlayIcon';
import ColorModeLightIcon from './icons/ColorModeLightIcon';
import { Logo } from './Logo/Logo';
import FramesIcon from './icons/FramesIcon';
import AddIcon from './icons/AddIcon';
import SettingsIcon from './icons/SettingsIcon';
import { isMac } from '../utils/formatting';
import ToolbarItem from './ToolbarItem/ToolbarItem';

const staticTypes = __PLAYROOM_GLOBAL__STATIC_TYPES__;

const resizableConfig = (position: EditorPosition = 'bottom') => ({
  top: position === 'bottom',
  right: false,
  bottom: false,
  left: position === 'right',
  topRight: false,
  bottomRight: false,
  bottomLeft: false,
  topLeft: false,
});

const resolveDirection = (
  editorPosition: EditorPosition,
  editorHidden: boolean
) => {
  if (editorPosition === 'right') {
    return editorHidden ? 'left' : 'right';
  }

  return editorHidden ? 'up' : 'down';
};

const getTitle = (title: string | undefined) => {
  if (title) {
    return `${title} | Playroom`;
  }

  const configTitle = window?.__playroomConfig__.title;

  if (configTitle) {
    return `${configTitle} | Playroom`;
  }

  return 'Playroom';
};

export interface PlayroomProps {
  components: Record<string, ComponentType<any>>;
  themes: string[];
  widths: Array<number | 'Fit to window'>;
  snippets: Snippets;
}

export default ({ components, themes, widths, snippets }: PlayroomProps) => {
  const [
    {
      editorPosition,
      editorHeight,
      editorWidth,
      editorHidden,
      visibleThemes = [],
      visibleWidths = [],
      code,
      previewRenderCode,
      previewEditorCode,
      ready,
      title,
      validCursorPosition,
      activeToolbarPanel,
    },
    dispatch,
  ] = useContext(StoreContext);
  const displayedTitle = getTitle(title);
  const hasFilteredFrames =
    visibleThemes.length > 0 || visibleWidths.length > 0;
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

  const updateEditorSize = useDebouncedCallback(
    ({
      isVerticalEditor,
      offsetWidth,
      offsetHeight,
    }: {
      isVerticalEditor: boolean;
      offsetHeight: number;
      offsetWidth: number;
    }) => {
      dispatch({
        type: isVerticalEditor ? 'updateEditorWidth' : 'updateEditorHeight',
        payload: { size: isVerticalEditor ? offsetWidth : offsetHeight },
      });
    },
    1
  );

  const resetEditorPosition = useDebouncedCallback(() => {
    if (editorPosition === 'undocked') {
      dispatch({ type: 'resetEditorPosition' });
    }
  }, 1);

  if (!ready) {
    return null;
  }

  const codeEditor = (
    <Fragment>
      <div className={styles.editorContainer}>
        <Box
          className={styles.editorToolbar}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          paddingY="xxsmall"
          paddingX="large"
        >
          <Box display="flex" gap="large">
            <button
              className={styles.navButton}
              title={`Insert snippet (${isMac() ? '⌘K' : 'Ctrl+K'})`}
              disabled={!validCursorPosition}
              onClick={() => {
                dispatch({
                  type: 'toggleToolbar',
                  payload: { panel: 'snippets' },
                });
              }}
            >
              <AddIcon height={24} width={24} />
            </button>
          </Box>
          <Box display="flex" gap="xxsmall">
            <button
              className={styles.navButton}
              title={`${editorHidden ? 'Show' : 'Hide'} the editor`}
              onClick={() =>
                dispatch({ type: editorHidden ? 'showEditor' : 'hideEditor' })
              }
            >
              <ChevronIcon
                size={16}
                direction={resolveDirection(editorPosition, editorHidden)}
              />
            </button>
            <button className={styles.navButton}>
              <EditorBottomIcon height={16} width={16} />
            </button>
            <button className={styles.navButton}>
              <EditorRightIcon height={16} width={16} />
            </button>
            <button className={styles.navButton}>
              <SettingsIcon size={16} />
            </button>
          </Box>
        </Box>
        <CodeEditor
          code={code}
          editorHidden={editorHidden}
          onChange={(newCode: string) =>
            dispatch({ type: 'updateCode', payload: { code: newCode } })
          }
          previewCode={previewEditorCode}
          hints={componentsToHints(components, staticTypes)}
        />
        <StatusMessage />
      </div>
      {/* <div className={styles.toolbarContainer}>
      </div> */}
    </Fragment>
  );

  const isVerticalEditor = editorPosition === 'right';
  const isHorizontalEditor = editorPosition === 'bottom';
  const sizeStyles = {
    height: isHorizontalEditor ? editorHeight : 'auto',
    width: isVerticalEditor ? editorWidth : 'auto',
  };
  const editorContainer =
    editorPosition === 'undocked' ? (
      <WindowPortal
        height={window.outerHeight}
        width={window.outerWidth}
        onUnload={resetEditorPosition}
        onError={resetEditorPosition}
      >
        {codeEditor}
      </WindowPortal>
    ) : (
      <Resizable
        className={classnames(styles.resizableContainer, {
          [styles.resizableContainer_isRight]: isVerticalEditor,
          [styles.resizableContainer_isBottom]: isHorizontalEditor,
          [styles.resizableContainer_isHidden]: editorHidden,
        })}
        defaultSize={sizeStyles}
        size={sizeStyles}
        minWidth={isVerticalEditor ? styles.MIN_WIDTH : undefined}
        minHeight={styles.MIN_HEIGHT}
        onResize={(_event, _direction, { offsetWidth, offsetHeight }) => {
          updateEditorSize({ isVerticalEditor, offsetWidth, offsetHeight });
        }}
        enable={resizableConfig(editorPosition)}
        /*
         * Ensures resizable handles are stacked above the `codeEditor` component.
         * By default, handles are stacked below the editor as introduced in:
         * https://github.com/bokuweb/re-resizable/pull/827
         */
        handleStyles={
          editorPosition === 'bottom'
            ? { top: { zIndex: 1 } }
            : { left: { zIndex: 1 } }
        }
      >
        {codeEditor}
      </Resizable>
    );

  return (
    <div className={styles.root}>
      {title === undefined ? null : (
        <Helmet>
          <title>{displayedTitle}</title>
        </Helmet>
      )}
      <Box
        className={styles.navbar}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        paddingX="large"
      >
        <Box display="flex" gap="large">
          <Logo size={24} strokeWidth={9} />
          <input
            type="text"
            id="playroomTitleField"
            placeholder="Untitled Playroom"
            className={styles.titleField}
            aria-label="Edit Title"
            value={title}
            onChange={(e) =>
              dispatch({
                type: 'updateTitle',
                payload: { title: e.target.value },
              })
            }
          />
        </Box>
        <Box display="flex" gap="large">
          <ToolbarItem
            active={activeToolbarPanel === 'frames'}
            showIndicator={hasFilteredFrames}
            title="Configure visible frames"
            onClick={() => {
              dispatch({
                type: 'toggleToolbar',
                payload: { panel: 'frames' },
              });
            }}
          >
            <FramesIcon height={20} width={20} />
          </ToolbarItem>
          <ToolbarItem
            title="Preview playroom"
            disabled={code.trim().length === 0}
            onClick={() => {
              dispatch({
                type: 'toggleToolbar',
                payload: { panel: 'preview' },
              });
            }}
          >
            <PlayIcon size={20} />
          </ToolbarItem>
          <ToolbarItem
            title="Copy Playroom link"
            success={copying}
            onClick={copyHandler}
          >
            <ShareIcon size={20} />
          </ToolbarItem>
          <button className={styles.navButton}>
            <ColorModeLightIcon size={20} />
          </button>
        </Box>
      </Box>
      <Box
        className={[
          styles.previewContainer,
          editorHidden
            ? undefined
            : styles.previewContainerPosition[editorPosition],
        ]}
        style={assignInlineVars({
          [styles.editorSize]:
            editorPosition === 'right' ? editorWidth : editorHeight,
        })}
      >
        <Frames
          code={previewRenderCode || code}
          themes={
            visibleThemes && visibleThemes.length > 0 ? visibleThemes : themes
          }
          widths={
            visibleWidths && visibleWidths.length > 0 ? visibleWidths : widths
          }
        />
        <Toolbar widths={widths} themes={themes} snippets={snippets} />
      </Box>
      {editorContainer}
    </div>
  );
};
