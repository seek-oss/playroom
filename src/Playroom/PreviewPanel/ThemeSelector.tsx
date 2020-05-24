import React, { Fragment } from 'react';
import classnames from 'classnames';

import ChevronIcon from '../icons/ChevronIcon';
import { Text } from '../Text/Text';

// @ts-ignore
import styles from './ThemeSelector.less';

interface ThemeSelectorProps {
  themes: string[];
  visibleThemes: string[] | undefined;
  activeTheme: string;
  onChange: (theme: string) => void;
}

const themeOption = (theme: string) => (
  <option key={theme} value={theme}>
    {theme}
  </option>
);

export const ThemeSelector = ({
  themes,
  activeTheme,
  onChange,
  visibleThemes,
}: ThemeSelectorProps) => {
  const options =
    visibleThemes && visibleThemes.length > 0 ? (
      <Fragment>
        <optgroup label="Visible themes">
          {visibleThemes.map(themeOption)}
        </optgroup>
        <optgroup label="Available themes">
          {themes
            .filter((theme) => !visibleThemes.some((t) => t === theme))
            .map(themeOption)}
        </optgroup>
      </Fragment>
    ) : (
      themes.map(themeOption)
    );

  return (
    <div className={styles.root}>
      <label
        htmlFor="theme-select"
        className={classnames(styles.label, styles.row)}
      >
        <span className={classnames(styles.column, styles.minColumn)}>
          <Text>Theme:&nbsp;</Text>
        </span>
        <span className={styles.column}>
          <Text weight="strong" truncate>
            {activeTheme}
          </Text>
        </span>
        <span className={classnames(styles.column, styles.minColumn)}>
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
