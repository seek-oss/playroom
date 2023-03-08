import React, { useContext, ReactChild } from 'react';
import { Heading } from '../Heading/Heading';
import { ToolbarPanel } from '../ToolbarPanel/ToolbarPanel';
import {
  ColorScheme,
  EditorPosition,
  StoreContext,
} from '../../StoreContext/StoreContext';
import { Stack } from '../Stack/Stack';
import EditorRightIcon from '../icons/EditorRightIcon';
import EditorBottomIcon from '../icons/EditorBottomIcon';
import EditorUndockedIcon from '../icons/EditorUndockedIcon';

import * as styles from './SettingsPanel.css';
import ColorModeSystemIcon from '../icons/ColorModeSystemIcon';
import ColorModeLightIcon from '../icons/ColorModeLightIcon';
import ColorModeDarkIcon from '../icons/ColorModeDarkIcon';
import { Text } from '../Text/Text';

const positionIcon: Record<EditorPosition, ReactChild> = {
  undocked: <EditorUndockedIcon />,
  right: <EditorRightIcon />,
  bottom: <EditorBottomIcon />,
};

const colorModeIcon: Record<ColorScheme, ReactChild> = {
  light: <ColorModeLightIcon />,
  dark: <ColorModeDarkIcon />,
  system: <ColorModeSystemIcon />,
};

interface KeyboardShortcutProps {
  keybinding: string;
  description: string;
}

const KeyboardShortcut = ({
  keybinding,
  description,
}: KeyboardShortcutProps) => {
  const shortcutSegments = keybinding
    .split('+')
    .map((segment) => <kbd key={`${keybinding}-${segment}`}>{segment}</kbd>)
    .flatMap((segment, index) => (index === 0 ? [segment] : ['+', segment]));

  return (
    <div
      className={styles.radioContainer}
      style={{ justifyContent: 'space-between' }}
    >
      <Text>{description}</Text>
      <Text>
        <kbd>{shortcutSegments}</kbd>
      </Text>
    </div>
  );
};

interface SettingsPanelProps {}

export default ({}: SettingsPanelProps) => {
  const [{ editorPosition, colorScheme }, dispatch] = useContext(StoreContext);

  return (
    <ToolbarPanel data-testid="frame-panel">
      <Stack space="large" dividers>
        <fieldset className={styles.fieldset}>
          <legend>
            <Heading level="3">Editor Position</Heading>
          </legend>
          <div className={styles.radioContainer}>
            {['Bottom', 'Right'].map((option) => (
              <div key={option}>
                <input
                  type="radio"
                  name="editorPosition"
                  id={`editorPosition${option}`}
                  value={option.toLowerCase()}
                  title={option}
                  checked={option.toLowerCase() === editorPosition}
                  onChange={() =>
                    dispatch({
                      type: 'updateEditorPosition',
                      payload: {
                        position: option.toLowerCase() as EditorPosition,
                      },
                    })
                  }
                  className={styles.realRadio}
                />
                <label
                  htmlFor={`editorPosition${option}`}
                  className={styles.label}
                  title={option}
                >
                  <span className={styles.labelText}>
                    {positionIcon[option.toLowerCase() as EditorPosition]}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend>
            <Heading level="3">Color Scheme</Heading>
          </legend>
          <div className={styles.radioContainer}>
            {['Light', 'Dark', 'System'].map((option) => (
              <div key={option}>
                <input
                  type="radio"
                  name="colorScheme"
                  id={`colorScheme${option}`}
                  value={option.toLowerCase()}
                  title={option}
                  checked={option.toLowerCase() === colorScheme}
                  onChange={() =>
                    dispatch({
                      type: 'updateColorScheme',
                      payload: {
                        colorScheme: option.toLowerCase() as ColorScheme,
                      },
                    })
                  }
                  className={styles.realRadio}
                />
                <label
                  htmlFor={`colorScheme${option}`}
                  className={styles.label}
                  title={option}
                >
                  <span className={styles.labelText}>
                    {colorModeIcon[option.toLowerCase() as ColorScheme]}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        <Stack space="medium">
          <Heading level="3">Keyboard Shortcuts</Heading>
          <Stack space="medium" dividers>
            <KeyboardShortcut keybinding="Alt+Up" description="Swap line up" />
            <KeyboardShortcut
              keybinding="Alt+Down"
              description="Swap line down"
            />
            <KeyboardShortcut
              keybinding="Shift+Alt+Up"
              description="Duplicate line up"
            />
            <KeyboardShortcut
              keybinding="Shift+Alt+Down"
              description="Duplicate line down"
            />
            <KeyboardShortcut
              keybinding="Cmd+Alt+Up"
              description="Add cursor to prev line"
            />
            <KeyboardShortcut
              keybinding="Cmd+Alt+Down"
              description="Add cursor to next line"
            />
            <KeyboardShortcut
              keybinding="Cmd+D"
              description="Select next occurrence"
            />
            <KeyboardShortcut
              keybinding="Cmd+Shift+,"
              description="Wrap selection in tag"
            />
          </Stack>
        </Stack>
      </Stack>
    </ToolbarPanel>
  );
};
