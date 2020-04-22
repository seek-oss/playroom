import React from 'react';

import ChevronIcon from '../Toolbar/icons/ChevronSvg';
// @ts-ignore
import styles from './ThemeSelector.less';

interface ThemeSelectorProps {
  themes: string[];
  activeTheme: string;
  onChange: (theme: string) => void;
}
export default ({ themes, activeTheme, onChange }: ThemeSelectorProps) => (
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
      {themes.map(theme => (
        <option value={theme} key={theme}>
          {theme}
        </option>
      ))}
    </select>
  </div>
);
