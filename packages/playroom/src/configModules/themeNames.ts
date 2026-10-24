import themes from './themes';

export const noThemeName = '__PLAYROOM__NO_THEME__';

export const themeNames = Object.keys(themes);

export const themesEnabled =
  themeNames.filter((themeName) => themeName !== noThemeName).length > 0;
