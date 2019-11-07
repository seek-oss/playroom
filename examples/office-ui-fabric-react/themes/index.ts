// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

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
    white: '#ffffff'
  }
});

let theme = styling.getTheme();

module.exports = {
  themePrimary: theme.palette.themePrimary,
  themeLighterAlt: theme.palette.themeLighterAlt,
  themeLighter: theme.palette.themeLighter,
  themeLight: theme.palette.themeLight,
  themeTertiary: theme.palette.themeTertiary,
  themeSecondary: theme.palette.themeSecondary,
  themeDarkAlt: theme.palette.themeDarkAlt,
  themeDark: theme.palette.themeDark,
  themeDarker: theme.palette.themeDarker,
  neutralLighterAlt: theme.palette.neutralLighterAlt,
  neutralLighter: theme.palette.neutralLighter,
  neutralLight: theme.palette.neutralLight,
  neutralQuaternaryAlt: theme.palette.neutralQuaternaryAlt,
  neutralQuaternary: theme.palette.neutralQuaternary,
  neutralTertiaryAlt: theme.palette.neutralTertiaryAlt,
  neutralTertiary: theme.palette.neutralTertiary,
  neutralSecondary: theme.palette.neutralSecondary,
  neutralPrimaryAlt: theme.palette.neutralPrimaryAlt,
  neutralPrimary: theme.palette.neutralPrimary,
  neutralDark: theme.palette.neutralDark,
  black: theme.palette.black,
  white: theme.palette.white
};
