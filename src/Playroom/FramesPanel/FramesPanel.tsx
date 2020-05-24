import React, { useContext, ReactNode } from 'react';
import Checkmark from './CheckmarkSvg';
import { Heading } from '../Heading/Heading';
import { ToolbarPanel } from '../ToolbarPanel/ToolbarPanel';
import { StoreContext } from '../../StoreContext/StoreContext';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';

// @ts-ignore
import styles from './FramesPanel.less';

interface FramesPanelProps {
  availableWidths: number[];
  availableThemes: string[];
}

interface ResetButtonProps {
  onClick: () => void;
  children: ReactNode;
}

const ResetButton = ({ onClick, children }: ResetButtonProps) => (
  <button className={styles.reset} onClick={onClick}>
    {children}
  </button>
);

interface FrameHeadingProps {
  showReset: boolean;
  onReset: () => void;
  children: ReactNode;
}
const FrameHeading = ({ showReset, onReset, children }: FrameHeadingProps) => (
  <div className={styles.title}>
    <Heading level="3">{children}</Heading>
    {showReset && <ResetButton onClick={onReset}>Show all</ResetButton>}
  </div>
);

interface FrameOptionProps<Option> {
  option: Option;
  selected: boolean;
  visible: Option[];
  available: Option[];
  onChange: (options?: Option[]) => void;
}
function FrameOption<Option>({
  option,
  selected,
  visible,
  available,
  onChange,
}: FrameOptionProps<Option>) {
  return (
    <label className={styles.label}>
      <input
        type="checkbox"
        checked={selected}
        className={styles.checkbox}
        onChange={(ev) => {
          if (ev.target.checked) {
            const newVisiblePreference = [...visible, option];
            const isOriginalList =
              JSON.stringify(newVisiblePreference.sort()) ===
              JSON.stringify([...available].sort());
            onChange(isOriginalList ? undefined : newVisiblePreference);
          } else {
            onChange(visible.filter((p) => p !== option));
          }
        }}
      />
      <div className={styles.fakeCheckbox}>
        <Checkmark />
      </div>
      <Text truncate>{option}</Text>
    </label>
  );
}

export default ({ availableWidths, availableThemes }: FramesPanelProps) => {
  const [{ visibleWidths = [], visibleThemes = [] }, dispatch] = useContext(
    StoreContext
  );
  const hasThemes =
    availableThemes.filter(
      (themeName) => themeName !== '__PLAYROOM__NO_THEME__'
    ).length > 0;
  const hasFilteredWidths =
    visibleWidths.length > 0 && visibleWidths.length <= availableWidths.length;
  const hasFilteredThemes =
    visibleThemes.length > 0 && visibleThemes.length <= availableThemes.length;

  return (
    <ToolbarPanel data-testid="frame-panel">
      <Stack space="large" dividers>
        <div data-testid="widthsPreferences">
          <FrameHeading
            showReset={hasFilteredWidths}
            onReset={() => dispatch({ type: 'resetVisibleWidths' })}
          >
            Widths
          </FrameHeading>

          {availableWidths.map((option) => (
            <FrameOption
              key={option}
              option={option}
              selected={hasFilteredWidths && visibleWidths.includes(option)}
              visible={visibleWidths}
              available={availableWidths}
              onChange={(newWidths) => {
                if (newWidths) {
                  dispatch({
                    type: 'updateVisibleWidths',
                    payload: { widths: newWidths },
                  });
                } else {
                  dispatch({ type: 'resetVisibleWidths' });
                }
              }}
            />
          ))}
        </div>

        {hasThemes ? (
          <div data-testid="themePreferences">
            <FrameHeading
              showReset={hasFilteredThemes}
              onReset={() => dispatch({ type: 'resetVisibleThemes' })}
            >
              Themes
            </FrameHeading>

            {availableThemes.map((option) => (
              <FrameOption
                key={option}
                option={option}
                selected={hasFilteredThemes && visibleThemes.includes(option)}
                visible={visibleThemes}
                available={availableThemes}
                onChange={(newThemes) => {
                  if (newThemes) {
                    dispatch({
                      type: 'updateVisibleThemes',
                      payload: { themes: newThemes },
                    });
                  } else {
                    dispatch({ type: 'resetVisibleThemes' });
                  }
                }}
              />
            ))}
          </div>
        ) : null}
      </Stack>
    </ToolbarPanel>
  );
};
