import React, { useState, useEffect } from 'react';
import SettingsSvg from '../../assets/icons/config';
import styles from './ConfigPanel.less';
import get from 'lodash/get';

const ConfigPanel = ({ frames, onChange }) => {
  const availableThemes = new Set(
    frames.map(f => f.theme).filter(f => f !== '__PLAYROOM__NO_THEME__')
  );
  const availableWidths = new Set(frames.map(f => f.width));

  const [views, setViews] = useState({
    themes: availableThemes,
    widths: availableWidths
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    onChange(views);
  }, []);

  function handleChange(e) {
    const type = get(e, 'target.name');
    const checked = get(e, 'target.checked');

    let value = get(e, 'target.value');

    if (type === 'widths') {
      value = parseInt(value, 10);
    }

    if (checked) {
      views[type].add(value);
    } else {
      views[type].delete(value);
    }

    setViews(views);
    onChange(views);
  }

  function toggleMenu() {
    setOpen(!open);
  }

  return !open ? (
    <SettingsSvg className={styles.configButton} onClick={toggleMenu} />
  ) : (
    <form onChange={handleChange} className={styles.form}>
      <SettingsSvg className={styles.configButton} onClick={toggleMenu} />

      {availableThemes.size > 0 && (
        <fieldset className={styles.fieldset}>
          <legend className={styles.title}>Themes</legend>
          {Array.from(availableThemes).map(theme => (
            <label
              className={views.themes.has(theme) && styles.active}
              key={theme}
            >
              <input
                type="checkbox"
                defaultChecked={views.themes.has(theme)}
                name="themes"
                value={theme}
              />{' '}
              {theme}
            </label>
          ))}
        </fieldset>
      )}

      <fieldset className={styles.fieldset}>
        <legend className={styles.title}>Screen Widths</legend>
        {Array.from(availableWidths).map(width => (
          <label
            className={views.widths.has(width) && styles.active}
            key={width}
          >
            <input
              type="checkbox"
              defaultChecked={views.widths.has(width)}
              name="widths"
              value={width}
            />{' '}
            {width}
          </label>
        ))}
      </fieldset>
    </form>
  );
};

export default ConfigPanel;
