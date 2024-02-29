import React, { useContext, type ReactChild } from 'react';
import { Helmet } from 'react-helmet';
import { Heading } from '../Heading/Heading';
import { ToolbarPanel } from '../ToolbarPanel/ToolbarPanel';
import {
  type ColorScheme,
  type EditorPosition,
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
import { isMac } from '../../utils/formatting';

const getKeyBindings = () => {
  const metaKeySymbol = isMac() ? '⌘' : 'Ctrl';
  const altKeySymbol = isMac() ? '⌥' : 'Alt';

  return {
    'Format code': [metaKeySymbol, 'S'],
    'Toggle comment': [metaKeySymbol, '/'],
    'Wrap selection in tag': [metaKeySymbol, '⇧', ','],
    'Select next occurrence': [metaKeySymbol, 'D'],
    'Swap line up': [altKeySymbol, '↑'],
    'Swap line down': [altKeySymbol, '↓'],
    'Duplicate line up': ['⇧', altKeySymbol, '↑'],
    'Duplicate line down': ['⇧', altKeySymbol, '↓'],
    'Add cursor to prev line': [metaKeySymbol, altKeySymbol, '↑'],
    'Add cursor to next line': [metaKeySymbol, altKeySymbol, '↓'],
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
      <Text size={isMac() ? 'large' : 'standard'}>
        <Inline space="xxsmall">{shortcutSegments}</Inline>
      </Text>
    </div>
  );
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

export default React.memo(() => {
  const [{ editorPosition, colorScheme, title }, dispatch] =
    useContext(StoreContext);

  const keybindings = getKeyBindings();

  const displayedTitle = getTitle(title);

  return (
    <>
      {title === undefined ? null : (
        <Helmet>
          <title>{displayedTitle}</title>
        </Helmet>
      )}
      <ToolbarPanel data-testid="settings-panel">
        <Stack space="xxxlarge">
          <label>
            <Stack space="medium">
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
    </>
  );
});
