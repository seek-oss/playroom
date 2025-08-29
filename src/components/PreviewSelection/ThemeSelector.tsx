import clsx from 'clsx';
import { Fragment } from 'react';

import { themeNames } from '../../configModules/themes';
import { Text } from '../Text/Text';
import ChevronIcon from '../icons/ChevronIcon';

import * as styles from './ThemeSelector.css';

interface ThemeSelectorProps {
  selectedThemes: string[];
  activeTheme: string;
  onChange: (theme: string) => void;
}

const themeOption = (theme: string) => (
  <option key={theme} value={theme}>
    {theme}
  </option>
);

export const ThemeSelector = ({
  activeTheme,
  onChange,
  selectedThemes,
}: ThemeSelectorProps) => {
  const options =
    selectedThemes.length > 0 ? (
      <Fragment>
        <optgroup label="Visible themes">
          {selectedThemes.map(themeOption)}
        </optgroup>
        <optgroup label="Available themes">
          {themeNames
            .filter((theme) => !selectedThemes.some((t) => t === theme))
            .map(themeOption)}
        </optgroup>
      </Fragment>
    ) : (
      themeNames.map(themeOption)
    );

  return (
    <div className={styles.root}>
      <label htmlFor="theme-select" className={clsx(styles.label, styles.row)}>
        <span className={clsx(styles.column, styles.minColumn)}>
          <Text>Theme:&nbsp;</Text>
        </span>
        <span className={styles.column}>
          <Text weight="strong" truncate>
            {activeTheme}
          </Text>
        </span>
        <span className={clsx(styles.column, styles.minColumn)}>
          &nbsp;
          <span style={{ position: 'relative', top: 2 }}>
            <ChevronIcon size={16} />
          </span>
        </span>
      </label>

      <select
        className={styles.select}
        aria-label="Select theme"
        title="Select theme"
        value={activeTheme}
        id="theme-select"
        onChange={(e) => {
          onChange(e.target.value);
        }}
      >
        {options}
      </select>
      <div className={styles.focusOverlay} />
    </div>
  );
};
