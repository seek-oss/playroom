import React, { useContext, type ReactElement } from 'react';

import {
  type ColorScheme,
  type EditorPosition,
  editorPositions,
  StoreContext,
} from '../../StoreContext/StoreContext';
import { isMac } from '../../utils/formatting';
import { Box } from '../Box/Box';
import { Heading } from '../Heading/Heading';
import { Inline } from '../Inline/Inline';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';
import { ToolbarPanel } from '../ToolbarPanel/ToolbarPanel';
import ColorModeDarkIcon from '../icons/ColorModeDarkIcon';
import ColorModeLightIcon from '../icons/ColorModeLightIcon';
import ColorModeSystemIcon from '../icons/ColorModeSystemIcon';
import EditorBottomIcon from '../icons/EditorBottomIcon';
import { EditorLeftIcon, EditorRightIcon } from '../icons/EditorHorizontalIcon';

import * as styles from './SettingsPanel.css';

const getKeyBindings = () => {
  const metaKeySymbol = isMac() ? '⌘' : 'Ctrl';
  const altKeySymbol = isMac() ? '⌥' : 'Alt';
  const shiftKeySymbol = isMac() ? '⇧' : 'Shift';

  return {
    Find: [metaKeySymbol, 'F'],
    'Find and replace': [metaKeySymbol, altKeySymbol, 'F'],
    'Toggle comment': [metaKeySymbol, '/'],
    'Wrap selection in tag': [metaKeySymbol, shiftKeySymbol, ','],
    'Format code': [metaKeySymbol, 'S'],
    'Insert snippet': [metaKeySymbol, 'K'],
    'Select next occurrence': [metaKeySymbol, 'D'],
    'Jump to line number': [metaKeySymbol, 'G'],
    'Swap line up': [altKeySymbol, '↑'],
    'Swap line down': [altKeySymbol, '↓'],
    'Duplicate line up': [shiftKeySymbol, altKeySymbol, '↑'],
    'Duplicate line down': [shiftKeySymbol, altKeySymbol, '↓'],
    'Add cursor to prev line': [metaKeySymbol, altKeySymbol, '↑'],
    'Add cursor to next line': [metaKeySymbol, altKeySymbol, '↓'],
  };
};

const positionIcon: Record<EditorPosition, ReactElement> = {
  left: <EditorLeftIcon />,
  bottom: <EditorBottomIcon />,
  right: <EditorRightIcon />,
};

const colorModeIcon: Record<ColorScheme, ReactElement> = {
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
    <Inline space="small" alignY="center">
      <Box flexGrow={1}>
        <Text>{description}</Text>
      </Box>
      <Text size={isMac() ? 'large' : 'standard'}>
        <div className={styles.keyboardShortcutKeys}>{shortcutSegments}</div>
      </Text>
    </Inline>
  );
};

export default React.memo(() => {
  const [{ editorPosition, colorScheme }, dispatch] = useContext(StoreContext);

  const keybindings = getKeyBindings();

  return (
    <ToolbarPanel>
      <Stack space="xxxlarge">
        <fieldset className={styles.fieldset}>
          <Stack space="small">
            <legend>
              <Heading level="3">Editor Position</Heading>
            </legend>
            <Inline space="none">
              {editorPositions.map((name) => {
                const nameInTitleCase =
                  name.charAt(0).toUpperCase() + name.slice(1);

                return (
                  <div key={nameInTitleCase}>
                    <input
                      type="radio"
                      name="editorPosition"
                      id={`editorPosition${nameInTitleCase}`}
                      value={name}
                      title={nameInTitleCase}
                      checked={name === editorPosition}
                      onChange={() =>
                        dispatch({
                          type: 'updateEditorPosition',
                          payload: {
                            position: name,
                          },
                        })
                      }
                      className={styles.realRadio}
                    />
                    <label
                      htmlFor={`editorPosition${nameInTitleCase}`}
                      className={styles.label}
                      title={nameInTitleCase}
                    >
                      {positionIcon[name]}
                    </label>
                  </div>
                );
              })}
            </Inline>
          </Stack>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <Stack space="small">
            <legend>
              <Heading level="3">Color Scheme</Heading>
            </legend>
            <Inline space="none">
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
                    {colorModeIcon[option.toLowerCase() as ColorScheme]}
                  </label>
                </div>
              ))}
            </Inline>
          </Stack>
        </fieldset>

        <Stack space="xlarge">
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
