import { useEffect, useMemo } from 'react';

import { BasicContext } from './context';

export default ({ children, frameSettings }) => {
  const darkMode = useMemo(
    () => frameSettings.darkMode,
    [frameSettings.darkMode]
  );
  const compactMode = useMemo(
    () => frameSettings.compactMode,
    [frameSettings.compactMode]
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-dark', 'true');
    } else {
      document.documentElement.removeAttribute('data-dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (compactMode) {
      document.documentElement.setAttribute('data-compact', 'true');
    } else {
      document.documentElement.removeAttribute('data-compact');
    }
  }, [compactMode]);

  return (
    <BasicContext.Provider value="CONTEXT_VALUE">
      <style>
        {[
          'html, body { margin: 0; padding: 0; }',
          `[data-dark] { background: #000; color: #fff; }`,
          `[data-compact] { font-size: 10px; }`,
        ].join('\n')}
      </style>
      {children}
    </BasicContext.Provider>
  );
};
