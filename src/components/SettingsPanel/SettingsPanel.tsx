import React, { useContext, type ReactElement } from 'react';

import {
  type ColorScheme,
  type EditorPosition,
  StoreContext,
} from '../../contexts/StoreContext';
import { Heading } from '../Heading/Heading';
import { Inline } from '../Inline/Inline';
import { Stack } from '../Stack/Stack';
import { ToolbarPanel } from '../ToolbarPanel/ToolbarPanel';
import ColorModeDarkIcon from '../icons/ColorModeDarkIcon';
import ColorModeLightIcon from '../icons/ColorModeLightIcon';
import ColorModeSystemIcon from '../icons/ColorModeSystemIcon';
import EditorBottomIcon from '../icons/EditorBottomIcon';
import EditorRightIcon from '../icons/EditorRightIcon';

import * as styles from './SettingsPanel.css';

const positionIcon: Record<EditorPosition, ReactElement> = {
  right: <EditorRightIcon />,
  bottom: <EditorBottomIcon />,
};

const colorModeIcon: Record<ColorScheme, ReactElement> = {
  light: <ColorModeLightIcon />,
  dark: <ColorModeDarkIcon />,
  system: <ColorModeSystemIcon />,
};

export default React.memo(() => {
  const [{ editorPosition, colorScheme }, dispatch] = useContext(StoreContext);

  return (
    <ToolbarPanel>
      <Stack space="xlarge">
        <fieldset className={styles.fieldset}>
          <Stack space="xxsmall">
            <legend>
              <Heading level="3">Editor Position</Heading>
            </legend>
            <Inline space="xxxsmall">
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
                    {positionIcon[option.toLowerCase() as EditorPosition]}
                  </label>
                </div>
              ))}
            </Inline>
          </Stack>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <Stack space="xxsmall">
            <legend>
              <Heading level="3">Color Scheme</Heading>
            </legend>
            <Inline space="xxxsmall">
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
      </Stack>
    </ToolbarPanel>
  );
});
