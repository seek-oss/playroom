import dedent from 'dedent';
import {
  typeCode,
  assertFirstFrameContains,
  assertCodePaneContains,
  assertCodePaneLineCount,
  selectSnippetByIndex,
  filterSnippets,
  toggleSnippets,
  assertSnippetCount,
  assertSnippetsListIsVisible,
  mouseOverSnippet,
  loadPlayroom,
} from '../support/utils';

describe('Snippets', () => {
  beforeEach(() => {
    loadPlayroom();
    typeCode('<div>Initial <span>code');
  });

  it('driven with mouse', () => {
    // Open and format for insertion point
    toggleSnippets();
    assertSnippetsListIsVisible();
    assertCodePaneLineCount(8);

    // Browse snippetlist
    assertSnippetCount(4);
    mouseOverSnippet(0);
    assertFirstFrameContains('Initial code\nFoo\nFoo');
    mouseOverSnippet(1);
    assertFirstFrameContains('Initial code\nFoo\nRed Foo');
    mouseOverSnippet(2);
    assertFirstFrameContains('Initial code\nBar\nBar');

    // Close without persisting
    toggleSnippets();
    assertCodePaneContains('<div>Initial <span>code</span></div>');
    assertCodePaneLineCount(1);

    // Re-open and persist
    toggleSnippets();
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
    typeCode(`${navigator.platform.match('Mac') ? '{cmd}' : '{ctrl}'}k`);
    assertSnippetsListIsVisible();
    assertCodePaneLineCount(8);
    filterSnippets('{esc}');
    assertCodePaneLineCount(1);
    typeCode(`${navigator.platform.match('Mac') ? '{cmd}' : '{ctrl}'}k`);
    assertSnippetsListIsVisible();
    assertCodePaneLineCount(8);

    // Browse snippetlist
    assertSnippetCount(4);
    filterSnippets('{downarrow}');
    assertFirstFrameContains('Initial code\nFoo\nFoo');
    filterSnippets('{downarrow}');
    assertFirstFrameContains('Initial code\nFoo\nRed Foo');
    filterSnippets('{downarrow}');
    assertFirstFrameContains('Initial code\nBar\nBar');

    // Close without persisting
    filterSnippets('{esc}');
    assertCodePaneContains('<div>Initial <span>code</span></div>');
    assertCodePaneLineCount(1);

    // Re-open and persist
    typeCode(`${navigator.platform.match('Mac') ? '{cmd}' : '{ctrl}'}k`);
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
