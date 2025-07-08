import { assignInlineVars } from '@vanilla-extract/dynamic';
import clsx from 'clsx';
import { Resizable } from 're-resizable';
import { useContext, Fragment, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDebouncedCallback } from 'use-debounce';

import { StoreContext, type EditorPosition } from '../../contexts/StoreContext';
import { Box } from '../Box/Box';
import { CodeEditor } from '../CodeEditor/CodeEditor';
import Frames from '../Frames/Frames';
import { StatusMessage } from '../StatusMessage/StatusMessage';
import Toolbar from '../Toolbar/Toolbar';
import { WindowPortal } from '../WindowPortal';
import { ANIMATION_TIMEOUT } from '../constants';
import ChevronIcon from '../icons/ChevronIcon';

import * as styles from './Playroom.css';

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

export default () => {
  const [
    {
      editorPosition,
      editorHeight,
      editorWidth,
      editorHidden,
      code,
      previewRenderCode,
      previewEditorCode,
      ready,
      title,
    },
    dispatch,
  ] = useContext(StoreContext);

  // This is necessary because this updates slightly after editorHidden updates,
  // not at the same time
  const [editorVisibilityAfterTransition, setEditorVisibilityAfterTransition] =
    useState<boolean>(editorHidden);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setEditorVisibilityAfterTransition(editorHidden);
    }, ANIMATION_TIMEOUT);

    return () => clearTimeout(timeoutId);
  }, [editorHidden]);

  const editorAvailable = !editorHidden && !editorVisibilityAfterTransition;

  const displayedTitle = getTitle(title);

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
      <div
        inert={!editorHidden ? false : undefined}
        className={styles.editorContainer}
      >
        <CodeEditor
          code={code}
          editorHidden={editorHidden}
          onChange={(newCode: string) =>
            dispatch({ type: 'updateCode', payload: { code: newCode } })
          }
          previewCode={previewEditorCode}
        />
        <StatusMessage />
      </div>
      <div className={styles.toolbarContainer}>
        <Toolbar />
      </div>
    </Fragment>
  );

  const isVerticalEditor = editorPosition === 'right';
  const isHorizontalEditor = editorPosition === 'bottom';

  const sizeStyles = {
    height: isHorizontalEditor ? editorHeight : 'auto',
    width: isVerticalEditor ? editorWidth : 'auto',
  };
  const hiddenSizeStyles = {
    height: isHorizontalEditor ? 0 : 'auto',
    width: isVerticalEditor ? 0 : 'auto',
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
        style={assignInlineVars({
          [styles.editorSize]:
            editorPosition === 'right' ? editorWidth : editorHeight,
        })}
        className={clsx({
          [styles.resizable]: true,
          [styles.resizableSize[editorPosition]]: !editorHidden,
          [styles.resizableUnavailable]: !editorAvailable,
          [styles.resizableAvailable[editorPosition]]: editorAvailable,
        })}
        defaultSize={sizeStyles}
        size={editorHidden ? hiddenSizeStyles : sizeStyles}
        onResize={(_event, _direction, { offsetWidth, offsetHeight }) => {
          updateEditorSize({ isVerticalEditor, offsetWidth, offsetHeight });
        }}
        onResizeStart={(_event, _direction, _refToElement) => {
          _refToElement.classList.remove(styles.resizableSize[editorPosition]);
        }}
        onResizeStop={(_event, _direction, _refToElement) => {
          _refToElement.classList.add(styles.resizableSize[editorPosition]);
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
    <Box
      display="flex"
      height="viewport"
      width="viewport"
      className={styles.root[editorPosition]}
    >
      {title === undefined ? null : (
        <Helmet>
          <title>{displayedTitle}</title>
        </Helmet>
      )}

      <Box position="relative" flexGrow={1} className={styles.previewContainer}>
        <Frames code={previewRenderCode || code} />
        <div
          className={clsx(styles.toggleEditorContainer, {
            [styles.isBottom]: isHorizontalEditor,
          })}
        >
          <button
            className={styles.toggleEditorButton}
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
        </div>
      </Box>
      {editorContainer}
    </Box>
  );
};
