import React, { useContext, useReducer, ReactChild } from 'react';
import classnames from 'classnames';
import ViewPreference from '../ViewPreference/ViewPreference';
import { StoreContext, EditorPosition } from '../../StoreContext/StoreContext';
import WidthsSvg from './icons/WidthsSvg';
import ThemesSvg from './icons/ThemesSvg';
import ToolbarItem from '../ToolbarItem/ToolbarItem';
import EditorUndockedSvg from './icons/EditorUndockedSvg';
import EditorBottomSvg from './icons/EditorBottomSvg';
import EditorRightSvg from './icons/EditorRightSvg';

// @ts-ignore
import styles from './Toolbar.less';

interface Props {
  themes: string[];
  widths: number[];
}

interface State {
  open: boolean;
  activePreference: 'theme' | 'width' | 'position' | null;
}

const initialState: State = {
  open: false,
  activePreference: null
};

type Action =
  | { type: 'toggleThemes' }
  | { type: 'toggleWidths' }
  | { type: 'togglePosition' }
  | { type: 'closeToolbar' };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'toggleThemes': {
      const isAlreadyActive = state.activePreference === 'theme';

      return {
        ...state,
        open: !isAlreadyActive,
        activePreference: isAlreadyActive ? null : 'theme'
      };
    }

    case 'toggleWidths': {
      const isAlreadyActive = state.activePreference === 'width';

      return {
        ...state,
        open: !isAlreadyActive,
        activePreference: isAlreadyActive ? null : 'width'
      };
    }

    case 'togglePosition': {
      const isAlreadyActive = state.activePreference === 'position';

      return {
        ...state,
        open: false,
        activePreference: isAlreadyActive ? null : 'position'
      };
    }

    case 'closeToolbar': {
      return {
        ...state,
        open: false,
        activePreference: null
      };
    }

    default:
      return state;
  }
};

const positions = ['undocked', 'right', 'bottom'] as const;
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

export default ({ themes: allThemes, widths: allWidths }: Props) => {
  const [
    { visibleThemes, visibleWidths, editorPosition },
    dispatchPreference
  ] = useContext(StoreContext);

  const [{ open, activePreference }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const isThemeOpen = activePreference === 'theme' && open;
  const isWidthOpen = activePreference === 'width' && open;
  const isPositionOpen = activePreference === 'position';
  const hasThemes =
    allThemes.filter(themeName => themeName !== '__PLAYROOM__NO_THEME__')
      .length > 0;

  return (
    <div
      className={classnames(styles.root, {
        [styles.isOpen]: open
      })}
    >
      {(open || isPositionOpen) && (
        <div
          className={styles.backdrop}
          onClick={() => dispatch({ type: 'closeToolbar' })}
        />
      )}
      <div className={styles.background} />
      <div className={styles.sidebar}>
        <div className={styles.buttons}>
          <div
            className={classnames(styles.topButtons, {
              [styles.topButtons_hide]: isPositionOpen
            })}
          >
            {hasThemes && (
              <ToolbarItem
                active={isThemeOpen}
                count={visibleThemes ? visibleThemes.length : 0}
                title={
                  visibleThemes
                    ? `Showing ${visibleThemes.length} of ${allThemes.length} themes`
                    : 'Configure themes'
                }
                onClick={() => dispatch({ type: 'toggleThemes' })}
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
              onClick={() => dispatch({ type: 'toggleWidths' })}
            >
              <WidthsSvg />
            </ToolbarItem>
          </div>

          <div className={styles.currentPosition}>
            <ToolbarItem
              active={isPositionOpen}
              title="Configure editor position"
              onClick={() => dispatch({ type: 'togglePosition' })}
            >
              {positionIcon[editorPosition].component}
            </ToolbarItem>
          </div>

          <div
            aria-hidden={isPositionOpen ? undefined : 'true'}
            className={classnames(styles.positionContainer, {
              [styles.positions_isOpen]: isPositionOpen
            })}
            onClick={() => dispatch({ type: 'closeToolbar' })}
          >
            {positions
              .filter(pos => pos !== editorPosition)
              .map(pos => (
                <div key={pos} className={styles.position}>
                  <ToolbarItem
                    title={positionIcon[pos].title}
                    onClick={() => {
                      dispatchPreference({
                        type: 'updateEditorPosition',
                        payload: { position: pos }
                      });
                      dispatch({ type: 'closeToolbar' });
                    }}
                  >
                    {positionIcon[pos].component}
                  </ToolbarItem>
                </div>
              ))}
          </div>
        </div>

        <div className={styles.panel}>
          <div
            aria-hidden={isThemeOpen ? undefined : 'true'}
            className={classnames(styles.preference, {
              [styles.preference_isActive]: isThemeOpen
            })}
          >
            <ViewPreference
              title="Themes"
              visible={visibleThemes || []}
              available={allThemes}
              onChange={newThemes => {
                if (newThemes) {
                  dispatchPreference({
                    type: 'updateVisibleThemes',
                    payload: { themes: newThemes }
                  });
                } else {
                  dispatchPreference({ type: 'resetVisibleThemes' });
                }
              }}
              onReset={() => dispatchPreference({ type: 'resetVisibleThemes' })}
            />
          </div>
          <div
            aria-hidden={isWidthOpen ? undefined : 'true'}
            className={classnames(styles.preference, {
              [styles.preference_isActive]: isWidthOpen
            })}
          >
            <ViewPreference
              title="Widths"
              visible={visibleWidths || []}
              available={allWidths}
              onChange={newWidths => {
                if (newWidths) {
                  dispatchPreference({
                    type: 'updateVisibleWidths',
                    payload: { widths: newWidths }
                  });
                } else {
                  dispatchPreference({ type: 'resetVisibleWidths' });
                }
              }}
              onReset={() => dispatchPreference({ type: 'resetVisibleWidths' })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
