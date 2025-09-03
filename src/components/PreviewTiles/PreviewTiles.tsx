import { assignInlineVars } from '@vanilla-extract/dynamic';
import { useContext, useMemo } from 'react';

import { decompressParams } from '../../../utils';
import { StoreContext } from '../../contexts/StoreContext';
import { compileJsx } from '../../utils/compileJsx';
import frameSrc from '../Frames/frameSrc';
import { Text } from '../Text/Text';

import * as styles from './PreviewTiles.css';

const scale = 0.5;
export const PreviewTiles = ({ onSelect }: { onSelect: () => void }) => {
  const [{ selectedThemes, storedPlayrooms }, dispatch] =
    useContext(StoreContext);

  const sortedPlayroomEntries = useMemo(
    () =>
      Object.entries(storedPlayrooms)
        .sort(
          ([, { lastModifiedDate: aDate }], [, { lastModifiedDate: bDate }]) =>
            bDate.getTime() - aDate.getTime()
        )
        .map(([id, storedPlayroom]) => {
          const params = decompressParams(storedPlayroom.dataParam);
          const { themes, code = '' } = params;
          const themeName =
            themes?.length === 1 ? themes[0] : selectedThemes[0];

          return {
            id,
            code,
            params,
            themeName,
          };
        }),
    [storedPlayrooms, selectedThemes]
  );

  return (
    <ul className={styles.tiles}>
      {sortedPlayroomEntries.map(({ id, params, code, themeName }) => (
        <li
          key={id}
          className={styles.tile}
          style={assignInlineVars({
            [styles.scaleVar]: `${scale}`,
          })}
        >
          <iframe
            tabIndex={-1}
            className={styles.iframe}
            src={frameSrc({ themeName, code: compileJsx(code) })}
          />
          <span className={styles.titleContainer}>
            <Text truncate>{params.title || 'Untitled Playroom'}</Text>
          </span>
          <button
            className={styles.button}
            onClick={() => {
              dispatch({
                type: 'openPlayroom',
                payload: {
                  ...params,
                  id,
                  code,
                },
              });
              onSelect();
            }}
          />
        </li>
      ))}
    </ul>
  );
};
