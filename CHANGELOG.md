# playroom

## 1.0.5

### Patch Changes

- [#467](https://github.com/seek-oss/playroom/pull/467) [`fad3b7f`](https://github.com/seek-oss/playroom/commit/fad3b7fc3fb7e58ee240595ba99994bc2701d5c2) Thanks [@askoufis](https://github.com/askoufis)! - Remove unused code, remove unused deps, update `sucrase` to latest version

## 1.0.4

### Patch Changes

- [#465](https://github.com/seek-oss/playroom/pull/465) [`63a512b`](https://github.com/seek-oss/playroom/commit/63a512bf8c33d5af15a254dba8d4efd69a886df4) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Only show available themes and widths

  Ensure that themes or widths selected via the URL or from storage are valid options.

## 1.0.3

### Patch Changes

- [#461](https://github.com/seek-oss/playroom/pull/461) [`67c2517`](https://github.com/seek-oss/playroom/commit/67c25170b7673844642df04cb496b13dcbba76c6) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Design polish, refinements and fixes to internal system components.

- [#464](https://github.com/seek-oss/playroom/pull/464) [`12dc5ba`](https://github.com/seek-oss/playroom/commit/12dc5ba923f6030fd6df2a6beb0e6c5f0202a892) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Ensure `ref` and `inert` usage is React 18 compatible

- [#461](https://github.com/seek-oss/playroom/pull/461) [`67c2517`](https://github.com/seek-oss/playroom/commit/67c25170b7673844642df04cb496b13dcbba76c6) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Introduce scroll afforance for frames area

  Add subtle gradient to edges of frames container to indicate scrollability when the number of frames exceeds the window width

- [#461](https://github.com/seek-oss/playroom/pull/461) [`67c2517`](https://github.com/seek-oss/playroom/commit/67c25170b7673844642df04cb496b13dcbba76c6) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Allow selection of frame error

  Enables a user to select and copy the text from a frame error message.

- [#462](https://github.com/seek-oss/playroom/pull/462) [`65f7793`](https://github.com/seek-oss/playroom/commit/65f779344e6cc38fcfc64a2fa56f304476a75dda) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Only hide share actions from header without code

  The header actions in the top right are now available on page load.
  This enables the selection of frames and/or themes before any code is added to the editor.

  The share and preview actions are still hidden and revealed when code is entered into the editor.

## 1.0.2

### Patch Changes

- [#459](https://github.com/seek-oss/playroom/pull/459) [`76b5304`](https://github.com/seek-oss/playroom/commit/76b530476bbc75862a01e3ad8e61d94c93725749) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Ensure Playroom processes only its own styles

  Fixes an issue where consuming projects using [Vanilla Extract] may suffer from double processing of generated styles.

  [Vanilla Extract]: https://vanilla-extract.style/

## 1.0.1

### Patch Changes

- [#457](https://github.com/seek-oss/playroom/pull/457) [`1deb5f5`](https://github.com/seek-oss/playroom/commit/1deb5f589ca532897f83d830166a6270e9468dc1) Thanks [@askoufis](https://github.com/askoufis)! - Fix compilation errors caused by internal styles

## 1.0.0

### Major Changes

- [#453](https://github.com/seek-oss/playroom/pull/453) [`abc492f`](https://github.com/seek-oss/playroom/commit/abc492f4c43fdc7a44eb6a129f0ec856cee6ebd9) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - This release features a major design overhaul, modernising the interface and introducing some exciting new features.
  Virtual file management now enables switching between multiple designs locally in the browser, while still supporting collaboration via shareable links.

  Highlights of the new interface include:

  - Designs autosave locally in the browser, using the title as a name
  - Return visits no longer restore the last code, instead listing locally saved designs as an option (or just start fresh)
  - Add "Open Playroom" option (with thumbnail previews) to make switching between designs easier
  - Add "New Playroom" option to quickly start fresh
  - Add "Duplicate" option to start a design variation
  - Improved affordance of editor actions, i.e. snippets, format, as well as cursor and selection actions.
  - Add "Show/Hide UI" option (with keyboard shortcut) to make focusing on design frames easier
  - Replace splash screen on Preview mode with dismissable header
  - Add "Edit" link to Preview mode header to make returning code easier
  - Add footer to Preview mode when embedding links
  - Improve affordance of syntax errors, including jump to line feature

## 0.44.4

### Patch Changes

- [#450](https://github.com/seek-oss/playroom/pull/450) [`2dfefd8`](https://github.com/seek-oss/playroom/commit/2dfefd810b2c161f9028f5fc52c575b1aac8d1f6) Thanks [@felixhabib](https://github.com/felixhabib)! - Ensure "Toggle comment" command works correctly when there is no other code in the editor.

- [#451](https://github.com/seek-oss/playroom/pull/451) [`4a515dc`](https://github.com/seek-oss/playroom/commit/4a515dc5171661c9b68f5013eb6db2111ad95505) Thanks [@felixhabib](https://github.com/felixhabib)! - Ensure "Format code" command works correctly when there is no code other than JSX comments in the editor.

## 0.44.3

### Patch Changes

- [#446](https://github.com/seek-oss/playroom/pull/446) [`aa4ac22`](https://github.com/seek-oss/playroom/commit/aa4ac229ec731b0051b2419982f80e7eaf37c874) Thanks [@felixhabib](https://github.com/felixhabib)! - Update method to manage tab titles

  Remove `react-helmet` dependency.

## 0.44.2

### Patch Changes

- [#442](https://github.com/seek-oss/playroom/pull/442) [`f1f8fbf`](https://github.com/seek-oss/playroom/commit/f1f8fbf64412572fa0bebefffaa04326794c7ccf) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Ensure code populates the editor on page load

  Resolves a timing issue where code would not be populated into the editor on page load in some browsers.

- [#443](https://github.com/seek-oss/playroom/pull/443) [`1a464a1`](https://github.com/seek-oss/playroom/commit/1a464a14ba6dc7d283060cab126a9b755a6c5fd7) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Evaluate `scope` in the context of `FrameComponent`

  Ensure the provided `scope` is evaluated within the context of the provided `FrameComponent`.
  This was a regression in the recent refactor, and fixing it enables usage of React Context by wrapping a Provider in the `FrameComponent` and retrieving its value via `scope`.

## 0.44.1

### Patch Changes

- [#426](https://github.com/seek-oss/playroom/pull/426) [`934992c`](https://github.com/seek-oss/playroom/commit/934992c6c9bb1b265375996e3971cc58a22ef3b3) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - refactor: Improve internal structure enable UI flexibility

- [#435](https://github.com/seek-oss/playroom/pull/435) [`f1f7869`](https://github.com/seek-oss/playroom/commit/f1f7869605640886a514f9511e10504c0ebe7a7d) Thanks [@felixhabib](https://github.com/felixhabib)! - Ensure UI size adapts to mobile browser toolbars that appear and disappear.

  Use dynamic viewport units to ensure the UI remains responsive across different devices.

- [#439](https://github.com/seek-oss/playroom/pull/439) [`61654dc`](https://github.com/seek-oss/playroom/commit/61654dc133809d7b5aafebfd70479dac4d84e62f) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Migrate top-level layout to CSS Grid

  Refactor the top-level layout of Playroom to use CSS Grid in preparation for upcoming UI features.

  Additionally, migrate away from `re-resizable` package for panel resizing in favour of a custom implementation to improve UI performance.

- [#438](https://github.com/seek-oss/playroom/pull/438) [`4ae409a`](https://github.com/seek-oss/playroom/commit/4ae409a96332fbbefb8fdaf89fb3760017dcc87d) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Remove legacy undocked editor mode

  An earlier version of Playroom had support for an undocked editor mode, previously hidden from the UI due to being buggy.
  Removing this code in preparation for UI uplift work.

- [#440](https://github.com/seek-oss/playroom/pull/440) [`a3e9893`](https://github.com/seek-oss/playroom/commit/a3e9893183830f3c23e46240af89edb256a9a9b1) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Refactor internal space and radius tokens

  Evolve the internal space and radius scales to be more fit for purpose with upcoming UI work.

## 0.44.0

### Minor Changes

- [#421](https://github.com/seek-oss/playroom/pull/421) [`6fd2aab`](https://github.com/seek-oss/playroom/commit/6fd2aabd4cb910972d9280a4707af361d35926ec) Thanks [@askoufis](https://github.com/askoufis)! - Playroom's utility API is now bundled for both ESM and CJS

  **BREAKING CHANGE:**

  Migrating the utils entries to TypeScript has necessitated an internal build step to produce both ESM and CJS versions.
  As a result, these APIs are now exposed as named exports at the top level of the `playroom` package.

  **MIGRATION GUIDE:**

  For ESM imports:

  ```diff
  -import { createUrl } from 'playroom/utils';
  +import { createUrl } from 'playroom';
  ```

  or for CJS usage:

  ```diff
  -const { createUrl } = require('playroom/utils');
  +const { createUrl } = require('playroom');
  ```

- [#417](https://github.com/seek-oss/playroom/pull/417) [`03d145d`](https://github.com/seek-oss/playroom/commit/03d145d755d9f431df632618604a807fcf181d21) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Improved handling of rendering errors

  Errors occurring during render no longer replace the frame contents with a red error message.
  Instead, the error is caught and overlaid on top of the last successful render result (when possible).

- [#414](https://github.com/seek-oss/playroom/pull/414) [`e69f698`](https://github.com/seek-oss/playroom/commit/e69f69896cf6c57a5a45a61330d9f4ea6c99bc97) Thanks [@felixhabib](https://github.com/felixhabib)! - Improve snippets search ranking algorithm.
  Results are now sorted primarily by the `group` property over the `name` property, making it easier to see related snippets together.

  Replace [`fuzzy`] dependency with [`fuse.js`] to enable result sorting.

  [`fuzzy`]: https://github.com/mattyork/fuzzy?tab=readme-ov-file
  [`fuse.js`]: https://github.com/krisk/fuse

- [#410](https://github.com/seek-oss/playroom/pull/410) [`6b5eaa3`](https://github.com/seek-oss/playroom/commit/6b5eaa33b8e6c32591da9e4d6a3ed90c526c61a2) Thanks [@felixhabib](https://github.com/felixhabib)! - Refactor layout.

  Improve the code editor show/hide animation.
  Prevent code contents from being searchable when the editor is hidden.

### Patch Changes

- [#424](https://github.com/seek-oss/playroom/pull/424) [`8795fde`](https://github.com/seek-oss/playroom/commit/8795fdeab1383886bc1adfdf417b600391a512ba) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Use `clsx` consistently for building class lists

  Remove `classnames` in favor of `clsx` for building class lists in the Playroom codebase.

- [#423](https://github.com/seek-oss/playroom/pull/423) [`4640ca1`](https://github.com/seek-oss/playroom/commit/4640ca1d93b044b932c2f5357369b65b3a65d1a6) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Preview: Improve accessibility of loading screen

- [#418](https://github.com/seek-oss/playroom/pull/418) [`1d59ba3`](https://github.com/seek-oss/playroom/commit/1d59ba345f800eaf94cc6747efc34608228dfcb6) Thanks [@felixhabib](https://github.com/felixhabib)! - Migrate some internal files from Javascript to Typescript.

## 0.43.1

### Patch Changes

- [#408](https://github.com/seek-oss/playroom/pull/408) [`059e9c7`](https://github.com/seek-oss/playroom/commit/059e9c7fa837e04198e612704320c94bb8d25b1f) Thanks [@askoufis](https://github.com/askoufis)! - CLI: Only require modules that are relevant to the CLI command being executed

## 0.43.0

### Minor Changes

- [#402](https://github.com/seek-oss/playroom/pull/402) [`6f30915`](https://github.com/seek-oss/playroom/commit/6f30915af90fded17cbad2351c7655dbceaa5d8c) Thanks [@felixhabib](https://github.com/felixhabib)! - Add 'Fit to window' frame width option

  Introduces a width option that dynamically sizes to use the maximum available frame space. This option will be available in addition to the existing supplied or default widths.

### Patch Changes

- [#402](https://github.com/seek-oss/playroom/pull/402) [`6f30915`](https://github.com/seek-oss/playroom/commit/6f30915af90fded17cbad2351c7655dbceaa5d8c) Thanks [@felixhabib](https://github.com/felixhabib)! - Fix styling issue, ensuring frame names and shadows show at a dimmed opacity except on hover

## 0.42.0

### Minor Changes

- [#397](https://github.com/seek-oss/playroom/pull/397) [`15a44bb`](https://github.com/seek-oss/playroom/commit/15a44bb679c113fda49732fcb47038137e641a97) Thanks [@askoufis](https://github.com/askoufis)! - Replace `fast-glob` dependency with [`tinyglobby`], removing 6 transitive dependencies

  BREAKING CHANGE:

  While `tinyglobby` aims to mimic `fast-glob`'s behaviour, not all behavior is guaranteed to be the same. The `typescriptFiles` property in your playroom config is the only property that is affected by this change. Please ensure any custom globs are functioning as expected.

  [`tinyglobby`]: https://github.com/SuperchupuDev/tinyglobby

- [#392](https://github.com/seek-oss/playroom/pull/392) [`dc14423`](https://github.com/seek-oss/playroom/commit/dc14423c137a604fb38b76b5b518588af391a69c) Thanks [@askoufis](https://github.com/askoufis)! - Enable embedded CSS formatting on save

  CSS authored inside `style` tags with a `jsx` attribute will now be formatted as CSS. This takes advantage of [prettier's embedded language formatting capabilities].

  For example:

  ```jsx
  <style jsx>
    {`
      .foo {
        color: red;
      }
    `}
  </style>
  ```

  [prettier's embedded language formatting capabilities]: https://prettier.io/docs/options#embedded-language-formatting

## 0.41.0

### Minor Changes

- [#396](https://github.com/seek-oss/playroom/pull/396) [`3ceb0af`](https://github.com/seek-oss/playroom/commit/3ceb0af613bb7f190b34371cacafee7928287ac7) Thanks [@askoufis](https://github.com/askoufis)! - Drop support for React 17

  BREAKING CHANGE: React 17 is no longer supported. Playroom now requires React 18 or later.

### Patch Changes

- [#396](https://github.com/seek-oss/playroom/pull/396) [`3ceb0af`](https://github.com/seek-oss/playroom/commit/3ceb0af613bb7f190b34371cacafee7928287ac7) Thanks [@askoufis](https://github.com/askoufis)! - Loosen `@types/react` and `@types/react-dom` dependencies to include `^18.0.0`

- [#393](https://github.com/seek-oss/playroom/pull/393) [`199c1e0`](https://github.com/seek-oss/playroom/commit/199c1e0c3341a0cc26a37ce2825a1e9bf1e8aa2a) Thanks [@askoufis](https://github.com/askoufis)! - Use the URL hash for passing params to each playroom iframe even when `paramType: 'search'` is configured

  This change prevents a full React re-render from occurring whenever code is changed in a playroom in projects that configure `paramType: 'search'`, resulting in a much smoother prototyping experience.

## 0.40.0

### Minor Changes

- b8f89d2: Set default colour scheme to 'system'.
- 16ec1e7: Update `react` and `react-dom` peer dependency ranges to include `^19`
- 857feab: Remove keybinding for copying Playroom link to clipboard.
- fab7863: Drop support for browser versions that do not support the `IntersectionObserver` API

  Playroom no longer provides a polyfill for [`IntersectionObserver`].

  [`intersectionobserver`]: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

### Patch Changes

- 4412ef1: Ensure favicon is displayed on Preview links.
- 6095dc4: Replace `polished` dependency with CSS relative color syntax and `color-mix`
- 16ec1e7: Remove `react-use` dependency
- 67006f0: Fix bug in "Wrap selection in tag" command that caused the start cursor to sometimes be in the wrong position when selecting an empty line.
- fb14616: Restrict `playroom`'s Vanilla Extract plugin to only process playroom's `.css.ts` files
- 719c957: Remove `lodash` dependency

## 0.39.1

### Patch Changes

- dbf3310: Update `re-resizable` dependency.

  Fix issue where resizable handles were stacked below the editor panel and could not be selected.

## 0.39.0

### Minor Changes

- d902e17: Save editor height and width preferences as a percentage of the viewport size, rather than a fixed pixel value.
  This prevents the editor from obscuring preview panels when toggling the browser tools on/off or resizing the window.
- 7aaa6d0: Save the state of the editor visibility to the Playroom URL.

  This allows you to share a Playroom link with the editor either open or closed on load.

- ee73b75: Update snippets behaviour to instantly navigate and scroll to the currently selected snippet.
  This eliminates sluggish feeling caused by smooth scroll.

### Patch Changes

- c5d5808: Fixes a bug that was causing erroneous snippet previews and broken preview updates when moving the cursor in the snippets panel while the snippets panel was closing.

## 0.38.1

### Patch Changes

- a62002d: Apply `title` from url on page load

  Previously the document `title` would only update when the frames panel is open.
  The title is now correctly reflected from the url on page load.

- cf0fa9e: start: Disable webpack error overlay

  Prevent the default webpack dev server error overlay from blocking the preview frames in `start` mode.
  Playroom handles its own errors, and this would block the preview frames and need to be dismissed manually.

## 0.38.0

### Minor Changes

- 7df36e3: Improve frame filtering UX.

  - Allow users to select all checkboxes in a frame filter section, rather than automatically unselecting all checkboxes when all are selected.
  - Rename the "Show all" button to "Clear" to reinforce the filtering pattern.

- 384810e: Use CSS gap and grid for layout spacing in Playroom UI.

### Patch Changes

- a0724d2: Fixes a bug in the side panel exit animation that was causing the contents to vanish abruptly
- 934a017: Exclude irrelevant files from published package
- 92a0039: Fix Playroom UI icon centering
- 422a259: Remove `data-testid` attributes from UI elements

## 0.37.1

### Patch Changes

- 2b6d5c5: Update lz-string to 1.5.0, and removed unnecessary @types/lz-string

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
