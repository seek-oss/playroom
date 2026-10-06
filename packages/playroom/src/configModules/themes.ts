import * as themes from '__PLAYROOM_ALIAS__THEMES__';

export const themeNames = Object.keys(themes);

export const themesEnabled =
  themeNames.filter((themeName) => themeName !== '__PLAYROOM__NO_THEME__')
    .length > 0;

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
export default themes as typeof import('__PLAYROOM_ALIAS__THEMES__').default;
