import React, { Fragment } from 'react';

import ChevronIcon from '../Toolbar/icons/ChevronSvg';
// @ts-ignore
import styles from './ThemeSelector.less';

interface ThemeSelectorProps {
  themes: string[];
  visibleThemes: string[] | undefined;
  activeTheme: string;
  onChange: (theme: string) => void;
}
export const ThemeSelector = ({
  themes,
  activeTheme,
  onChange,
  visibleThemes
}: ThemeSelectorProps) => {
  const options =
    visibleThemes && visibleThemes.length > 0 ? (
      <Fragment>
        <optgroup label="Visible themes">
          {visibleThemes.map(theme => (
            <option key={theme}>{theme}</option>
          ))}
        </optgroup>
        <optgroup label="Available themes">
          {themes
            .filter(theme => !visibleThemes.some(t => t === theme))
            .map(theme => (
              <option key={theme}>{theme}</option>
            ))}
        </optgroup>
      </Fragment>
    ) : (
      themes.map(theme => (
        <option value={theme} key={theme}>
          {theme}
        </option>
      ))
    );

  return (
    <div className={styles.root}>
      <label htmlFor="theme-select" className={styles.label}>
        Theme:{' '}
      </label>

      <div className={styles.selectValue}>{activeTheme}</div>
      <ChevronIcon size={16} />

      <select
        className={styles.select}
        aria-label="Select theme"
        title="Select theme"
        value={activeTheme}
        id="theme-select"
        onChange={e => {
          onChange(e.target.value);
        }}
      >
        {options}
      </select>
    </div>
  );
};
