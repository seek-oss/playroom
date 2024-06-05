import { useContext, type ReactNode } from 'react';
import Checkmark from './CheckmarkSvg';
import { Heading } from '../Heading/Heading';
import { ToolbarPanel } from '../ToolbarPanel/ToolbarPanel';
import { StoreContext } from '../../StoreContext/StoreContext';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';
import { Helmet } from 'react-helmet';
import { Inline } from '../Inline/Inline';
import { Box } from '../Box/Box';

import * as styles from './FramesPanel.css';

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
  <Inline space="none" alignY="center">
    <Box flexGrow={1}>
      <Heading level="3">{children}</Heading>
    </Box>
    {showReset && <ResetButton onClick={onReset}>Clear</ResetButton>}
  </Inline>
);

interface FrameOptionProps<Option> {
  option: Option;
  selected: boolean;
  visible: Option[];
  onChange: (options?: Option[]) => void;
}
function FrameOption<Option>({
  option,
  selected,
  visible,
  onChange,
}: FrameOptionProps<Option>) {
  return (
    <label className={styles.label}>
      <Inline space="large" alignY="center">
        <input
          type="checkbox"
          checked={selected}
          className={styles.checkbox}
          onChange={(event) => {
            if (event.target.checked) {
              const newVisiblePreference = [...visible, option];
              onChange(newVisiblePreference);
            } else {
              onChange(visible.filter((p) => p !== option));
            }
          }}
        />
        <div className={styles.fakeCheckbox}>
          <Checkmark />
        </div>
        <Text truncate>{String(option)}</Text>
      </Inline>
    </label>
  );
}

export default ({ availableWidths, availableThemes }: FramesPanelProps) => {
  const [{ visibleWidths = [], visibleThemes = [], title }, dispatch] =
    useContext(StoreContext);
  const hasThemes =
    availableThemes.filter(
      (themeName) => themeName !== '__PLAYROOM__NO_THEME__'
    ).length > 0;
  const hasFilteredWidths =
    visibleWidths.length > 0 && visibleWidths.length <= availableWidths.length;
  const hasFilteredThemes =
    visibleThemes.length > 0 && visibleThemes.length <= availableThemes.length;

  const displayedTitle = getTitle(title);

  return (
    <>
      {title === undefined ? null : (
        <Helmet>
          <title>{displayedTitle}</title>
        </Helmet>
      )}
      <ToolbarPanel>
        <Stack space="xxxlarge">
          <label>
            <Stack space="small">
              <Heading level="3">Title</Heading>
              <input
                type="text"
                id="playroomTitleField"
                placeholder="Enter a title for this Playroom..."
                className={styles.textField}
                value={title}
                onChange={(e) =>
                  dispatch({
                    type: 'updateTitle',
                    payload: { title: e.target.value },
                  })
                }
              />
            </Stack>
          </label>

          <Stack space="xlarge">
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
          </Stack>

          {hasThemes ? (
            <Stack space="xlarge">
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
            </Stack>
          ) : null}
        </Stack>
      </ToolbarPanel>
    </>
  );
};
