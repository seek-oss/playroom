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
import { Inline } from '../Inline/Inline';

const getKeyBindings = () => {
  const isMac = navigator.platform.match('Mac');

  const metaKeySymbol = isMac ? '⌘' : 'Ctrl';
  const altKeySymbol = isMac ? '⌥' : 'Alt';

  return {
    'Format code': [metaKeySymbol, 'S'],
    'Swap line up': [altKeySymbol, '↑'],
    'Swap line down': [altKeySymbol, '↓'],
    'Duplicate line up': ['⇧', altKeySymbol, '↑'],
    'Duplicate line down': ['⇧', altKeySymbol, '↓'],
    'Add cursor to prev line': [metaKeySymbol, altKeySymbol, '↑'],
    'Add cursor to next line': [metaKeySymbol, altKeySymbol, '↓'],
    'Select next occurrence': [metaKeySymbol, 'D'],
    'Wrap selection in tag': [metaKeySymbol, '⇧', ','],
  };
};

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
  keybinding: string[];
  description: string;
}

const KeyboardShortcut = ({
  keybinding,
  description,
}: KeyboardShortcutProps) => {
  const shortcutSegments = keybinding.map((segment) => (
    <kbd className={styles.kbd} key={`${keybinding}-${segment}`}>
      {segment}
    </kbd>
  ));

  return (
    <div className={styles.keyboardShortcutRow}>
      <Text>{description}</Text>
      <Text size="large">
        <Inline space="xxsmall">{shortcutSegments}</Inline>
      </Text>
    </div>
  );
};

export default React.memo(() => {
  const [{ editorPosition, colorScheme }, dispatch] = useContext(StoreContext);

  const keybindings = getKeyBindings();

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
          {Object.entries(keybindings).map(([description, keybinding]) => (
            <KeyboardShortcut
              description={description}
              keybinding={keybinding}
              key={description}
            />
          ))}
        </Stack>
      </Stack>
    </ToolbarPanel>
  );
});
