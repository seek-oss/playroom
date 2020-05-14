// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// eslint-disable-next-line @typescript-eslint/no-var-requires
const styling = require('@uifabric/styling');

styling.loadTheme({
  palette: {
    themePrimary: '#0078d4',
    themeLighterAlt: '#eff6fc',
    themeLighter: '#deecf9',
    themeLight: '#c7e0f4',
    themeTertiary: '#71afe5',
    themeSecondary: '#2b88d8',
    themeDarkAlt: '#106ebe',
    themeDark: '#005a9e',
    themeDarker: '#004578',
    neutralLighterAlt: '#f8f8f8',
    neutralLighter: '#f4f4f4',
    neutralLight: '#eaeaea',
    neutralQuaternaryAlt: '#dadada',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c8c8',
    neutralTertiary: '#c2c2c2',
    neutralSecondary: '#858585',
    neutralPrimaryAlt: '#4b4b4b',
    neutralPrimary: '#333333',
    neutralDark: '#272727',
    black: '#1d1d1d',
    white: '#ffffff',
  },
});

module.exports = {
  themePrimary: styling.themePrimary,
  themeLight: styling.themeLight,
  themeDark: styling.themeDark,
  neutralLight: styling.neutralLight,
  neutralQuaternary: styling.neutralQuaternary,
  neutralTertiary: styling.neutralTertiary,
  neutralSecondary: styling.neutralSecondary,
  neutralPrimary: styling.neutralPrimary,
  neutralDark: styling.neutralDark,
  black: styling.black,
  white: styling.white,
};
