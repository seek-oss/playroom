import dedent from 'dedent';

import {
  typeCode,
  assertFirstFrameContains,
  assertCodePaneContains,
  assertCodePaneLineCount,
  selectSnippetByIndex,
  filterSnippets,
  assertSnippetCount,
  assertSnippetsSearchFieldIsVisible,
  mouseOverSnippet,
  loadPlayroom,
  openSnippets,
  closeSnippets,
} from '../support/utils';

describe('Snippets', () => {
  beforeEach(() => {
    loadPlayroom();
    typeCode('<div>Initial <span>code');
  });

  it('driven with mouse', () => {
    // Open and format for insertion point
    openSnippets({ source: 'editorAction' });
    assertSnippetsSearchFieldIsVisible();
    assertCodePaneLineCount(8);

    // Browse snippetlist
    assertSnippetCount(5);
    mouseOverSnippet(0);
    assertFirstFrameContains('Initial code\nFoo\nFoo');
    mouseOverSnippet(1);
    assertFirstFrameContains('Initial code\nFoo\nRed Foo');
    mouseOverSnippet(2);
    assertFirstFrameContains('Initial code\nBar\nBar');

    // Close without persisting
    closeSnippets({ source: 'editorAction' });
    assertCodePaneContains('<div>Initial <span>code</span></div>');
    assertCodePaneLineCount(1);

    // Re-open and persist
    openSnippets({ source: 'editorAction' });
    mouseOverSnippet(3);
    assertFirstFrameContains('Initial code\nBar\nBlue Bar');
    selectSnippetByIndex(3).click();
    assertFirstFrameContains('Initial code\nBar\nBlue Bar');
    assertCodePaneLineCount(7);
    assertCodePaneContains(dedent`
        <div>
          Initial{" "}
          <span>
            code<Bar color="blue">Blue Bar</Bar>
          </span>
        </div>\n
      `);
    typeCode('cursor position');
    assertCodePaneContains(dedent`
        <div>
          Initial{" "}
          <span>
            code<Bar color="blue">Blue Bar</Bar>cursor position
          </span>
        </div>\n
      `);
  });

  it('driven with keyboard', () => {
    // Open and format for insertion point
    openSnippets({ source: 'keyboard' });
    assertSnippetsSearchFieldIsVisible();
    assertCodePaneLineCount(8);
    closeSnippets({ source: 'keyboard' });
    assertCodePaneLineCount(1, true);
    openSnippets({ source: 'keyboard' });
    assertSnippetsSearchFieldIsVisible();
    assertCodePaneLineCount(8);

    // Browse snippetlist
    assertSnippetCount(5);
    filterSnippets('{downarrow}');
    assertFirstFrameContains('Initial code\nFoo\nFoo');
    filterSnippets('{downarrow}');
    assertFirstFrameContains('Initial code\nFoo\nRed Foo');
    filterSnippets('{downarrow}');
    assertFirstFrameContains('Initial code\nBar\nBar');
    filterSnippets('variant'); // filter by description
    assertSnippetCount(1);
    assertFirstFrameContains('Initial code\nBar\nBlue Bar');

    // Close without persisting
    closeSnippets({ source: 'keyboard' });
    assertCodePaneContains('<div>Initial <span>code</span></div>');
    assertCodePaneLineCount(1, true);

    // Re-open and persist
    openSnippets({ source: 'keyboard' });
    filterSnippets('{downarrow}{downarrow}{downarrow}{downarrow}{enter}');
    assertFirstFrameContains('Initial code\nBar\nBlue Bar');
    assertCodePaneLineCount(7);
    assertCodePaneContains(dedent`
        <div>
          Initial{" "}
          <span>
            code<Bar color="blue">Blue Bar</Bar>
          </span>
        </div>\n
      `);
    typeCode('cursor position');
    assertCodePaneContains(dedent`
        <div>
          Initial{" "}
          <span>
            code<Bar color="blue">Blue Bar</Bar>cursor position
          </span>
        </div>\n
      `);
  });
});
