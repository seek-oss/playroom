# playroom

## 0.37.0

### Minor Changes

- 94c75f8: Add "Find", "Find and replace", and "Jump to line" functionality.

  Keybindings for these new commands are:

  - `Cmd + F` / `Ctrl + F` - Find
  - `Cmd + Option + F` / `Ctrl + Alt + F` - Find and replace
  - `Cmd + G` / `Ctrl + G` - Jump to line

### Patch Changes

- 71f694a: Fix issue with "Toggle comment" command commenting certain code outside JSX tags with incorrect syntax.

## 0.36.0

### Minor Changes

- c3f0373: Drop support for Node versions <18.12.0
- 90edcc8: Add keybinding for copying Playroom link to clipboard with <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>C</kbd> (or, on Windows, <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd>).
- c99cc30: Add keybinding to toggle comment syntax for the current selection.

  Pressing <kbd>Cmd</kbd> + <kbd>/</kbd> (or, on Windows, <kbd>Ctrl</kbd> + <kbd>/</kbd>) will toggle comment syntax for the currently selected text.
  If no text is selected, the line the cursor is on will toggle comment syntax.

### Patch Changes

- dd95719: Add 'Insert snippet' shortcut to 'Keyboard Shortcuts' list in settings panel for better discoverability.
- cad1ded: Remove dependency on `current-git-branch` package
- 0215bb4: Replace `query-string` dependency with `URLSearchParams`
- 6ad5895: Update shortcut format for Windows users for consistency with standard styling.
- cb3c427: In the Settings Panel, sort keyboard shortcuts order by most frequently and widely used. Related shortcuts are grouped together.
- b1766c2: Move Title setting from Settings Panel to Frame Panel to group current playroom settings together and improve discoverability.

  Now, all settings that affect the current playroom tab live in the Frame Panel.
  Settings affecting all playroom tabs live in the Settings Panel.

- 41e8cfa: Fix an issue where new Playroom tabs without a set title would load a recently used title.
- 134c5a4: Upgrade `webpack-dev-server` to v5
- c3f0373: Update dependencies
- f88a4e6: Fix async import of playroom config on Windows

## 0.35.0

### Minor Changes

- ad60e01: Add support for specifying default subsets of themes and screen widths via the config.

  #### Example usage

  ```js
  // playroom.config.js
  module.exports = {
    ...,
    defaultVisibleWidths: [
      // subset of widths to display on first load
    ],
    defaultVisibleThemes: [
      // subset of themes to display on first load
    ],
  }
  ```

- f45dd04: Add ability to customise tab titles via a "Title" section in the settings panel.

### Patch Changes

- f491105: Fix bug in "Wrap selection in tag" command that caused the start cursor to occasionally be placed in the wrong postion.

## 0.34.2

### Patch Changes

- 88bd204: Fix `playroom build` by making favicon path relative to webpack config

## 0.34.1

### Patch Changes

- e3b820b: Add favicon to Playroom site.
- 4fb69cb: Improve affordance of error marker detail

## 0.34.0

### Minor Changes

- 1c8ae6b: Use smaller React pragmas to reduce the payload sent to iframes
- c4b639c: Replace `@babel/standalone` with `sucrase` for JSX compilation

### Patch Changes

- 1c8ae6b: Highlight the correct error location when code has syntax errors

## 0.33.0

### Minor Changes

- 2d3571b: Add support for loading mjs config files

  Consumers should now be able to write their configuration files using ES modules. By default Playroom will look for `playroom.config.js` with either a `.js`, `.mjs` or `.cjs` file extension.

## 0.32.1

### Patch Changes

- a044864: Allow overriding Webpack module rules

  Consumers may have complex Webpack configurations that can clash with Playroom's.
  In this case, it's useful to be able to override the module rules that Playroom defines.
  For example, overriding loaders defined for CSS files:

  ```js
  // playroom.config.js
  module.exports = {
    webpackConfig: () => ({
      module: {
        rules: [
          // use your own CSS loaders
          { test: /\.css$/, use: ['style-loader', 'css-loader'] },
        ],
      },
    }),
  };
  ```

## 0.32.0

### Minor Changes

- 720d542: Drop support for React 16. Consumers are encouraged to upgrade to React 17+, which is a drop-in replacement.
- 720d542: Support TypeScript 5.0+

## 0.31.0

### Minor Changes

- 8ce01ff: Add keyboard shortcuts legend to the settings panel, to help with discoverability.
- 8ce01ff: Adds keybinding for wrapping the current selection in a tag.

  Pressing <kbd><kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>,</kbd></kbd> (or, on Windows, <kbd><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>,</kbd></kbd>) will wrap the currently selected text in an empty fragment that is ready to be typed in.

  Works for single cursors (doesn't wrap anything), single line selections, multi-line selections, and multiple cursors.

## 0.30.0

### Minor Changes

- b247e88: Adds multi-cursor support.

  The keyboard shortcuts added in the previous version (swap/duplicate line up/down) now support multiple cursors being on screen.
  "Select next occurrence" and "add cursor up/down" have also been implemented.

  | Keybinding                                                     | Action                  |
  | -------------------------------------------------------------- | ----------------------- |
  | <kbd><kbd>Alt</kbd> + <kbd>Up</kbd></kbd>                      | Swap line up            |
  | <kbd><kbd>Alt</kbd> + <kbd>Down</kbd></kbd>                    | Swap line down          |
  | <kbd><kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>Up</kbd></kbd>   | Duplicate line up       |
  | <kbd><kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>Down</kbd></kbd> | Duplicate line down     |
  | <kbd><kbd>Cmd</kbd> + <kbd>Alt</kbd> + <kbd>Up</kbd></kbd>     | Add cursor to prev line |
  | <kbd><kbd>Cmd</kbd> + <kbd>Alt</kbd> + <kbd>Down</kbd></kbd>   | Add cursor to next line |
  | <kbd><kbd>Cmd</kbd> + <kbd>D</kbd></kbd>                       | Select next occurrence  |

## 0.29.0

### Minor Changes

- 9fc8c0d: Adds VSCode-style keybindings for move line up/down and copy line up/down.
  Works for selections as well as single lines.

  See the VSCode keyboard shortcut reference for details ([Mac]/[Windows]).

  [mac]: https://code.visualstudio.com/shortcuts/keyboard-shortcuts-macos.pdf
  [windows]: https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf

## 0.28.2

### Patch Changes

- 8030325: Update all dependencies
- 8030325: Fix error message on gutter marker tooltip

  Playroom wraps the code in a Fragment to compile it and then removes it from the error message displayed as a tooltip on the gutter marker if it fails to compile.

  The logic has been improved to remove the first occurence of an opening `<React.Fragment>` and the last occurence of `</React.Fragment>`.

  Errors should no longer incorrectly have a stray closing fragment:

  ```diff
  "unknown: Expected corresponding JSX closing tag for <Boxerror>. (3:0)

     1 | <Boxerror>
     2 |   ...
  -> 3 | </Box></React.Fragment>
  +> 3 | </Box>
       | ^"
  ```

- cbcf1cf: Update dependencies (and move to pnpm internally)
