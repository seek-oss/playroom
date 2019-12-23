import React from 'react';
import Checkmark from './CheckmarkSvg';

// @ts-ignore
import styles from './ViewPreference.less';

interface Props<PreferenceType> {
  title: string;
  visible: PreferenceType[];
  available: PreferenceType[];
  onChange: (items?: PreferenceType[]) => void;
  onReset: () => void;
}

export default <PreferenceType extends string | number>({
  title,
  visible,
  available,
  onChange,
  onReset
}: Props<PreferenceType>) => {
  const isFiltered = visible.length > 0 && visible.length <= available.length;

  return (
    <aside data-testid={`${title.toLowerCase()}Preferences`}>
      <h4 className={styles.title}>
        {title}
        {isFiltered && (
          <button className={styles.reset} onClick={onReset}>
            Show all
          </button>
        )}
      </h4>

      {available.map(preference => (
        <label key={preference} className={styles.label}>
          <input
            type="checkbox"
            checked={isFiltered && visible.includes(preference)}
            className={styles.checkbox}
            onChange={ev => {
              if (ev.target.checked) {
                const newVisiblePreference = [...visible, preference];
                const isOriginalList =
                  JSON.stringify(newVisiblePreference.sort()) ===
                  JSON.stringify([...available].sort());

                onChange(isOriginalList ? undefined : newVisiblePreference);
              } else {
                onChange(visible.filter(p => p !== preference));
              }
            }}
          />
          <div className={styles.fakeCheckbox}>
            <Checkmark />
          </div>
          <div className={styles.labelText}>{preference}</div>
        </label>
      ))}
    </aside>
  );
};
