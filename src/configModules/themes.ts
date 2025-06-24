import * as themes from '__PLAYROOM_ALIAS__THEMES__';

export const themeNames = Object.keys(themes);

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
export default themes as typeof import('__PLAYROOM_ALIAS__THEMES__').default;
