import {
  assertFirstFrameContains,
  assertInspectModeActive,
  assertInspectModeInactive,
  assertInspectOverlayInFrame,
  cmdPlus,
  toggleInspectMode,
  getCodeEditor,
  getInspectHighlight,
  hoverTargetInFrame,
  loadPlayroom,
  simulateInspectMessage,
  typeCode,
} from '../support/utils';

describe('Inspect Element', () => {
  describe('Activation', () => {
    it('activates via button click', () => {
      loadPlayroom();
      typeCode('<Foo />');

      toggleInspectMode({ source: 'button' });
      assertInspectModeActive();
    });

    it('activates via keyboard shortcut', () => {
      loadPlayroom();
      typeCode('<Foo />');

      toggleInspectMode({ source: 'keyboard' });
      assertInspectModeActive();
    });

    it('renders inspect overlay inside frames when activated', () => {
      loadPlayroom();
      typeCode('<Foo />');

      assertFirstFrameContains('Foo');
      toggleInspectMode({ source: 'button' });
      assertInspectOverlayInFrame();
    });
  });

  describe('Deactivation', () => {
    it('deactivates via Escape key', () => {
      loadPlayroom();
      typeCode('<Foo />');

      toggleInspectMode({ source: 'button' });
      cy.get('body').type('{esc}');
      assertInspectModeInactive();
    });

    it('deactivates via keyboard shortcut toggle', () => {
      loadPlayroom();
      typeCode('<Foo />');

      toggleInspectMode({ source: 'keyboard' });
      toggleInspectMode({ source: 'keyboard' });
      assertInspectModeInactive();
    });

    it('deactivates when clicking outside iframes', () => {
      loadPlayroom();
      typeCode('<Foo />');

      toggleInspectMode({ source: 'button' });
      getCodeEditor().click();
      assertInspectModeInactive();
    });

    it('deactivates when iframe sends exit message', () => {
      loadPlayroom();
      typeCode('<Foo />');

      toggleInspectMode({ source: 'button' });
      simulateInspectMessage('exit');
      assertInspectModeInactive();
    });
  });

  describe('Element Selection', () => {
    it('positions overlay over hovered element', () => {
      loadPlayroom(`
        <Foo />
        <Bar />
        <div data-test-target style={{ border: '10px solid green', color: 'green', fontSize: 40, fontWeight: 700, height: 100 }}>Target Element</div>
      `);

      assertFirstFrameContains('Foo\nBar\nTarget Element');
      toggleInspectMode({ source: 'button' });
      assertInspectOverlayInFrame();

      hoverTargetInFrame('[data-test-target]');

      getInspectHighlight()
        .should('be.visible')
        .and('have.css', 'height', '100px');
    });

    it('highlights parent element when hovering content rendered via dangerouslySetInnerHTML', () => {
      loadPlayroom(`
        <Foo />
        <div data-test-target style={{ height: 80 }} dangerouslySetInnerHTML={{ __html: '<span data-inner>Inner HTML</span>' }} />
      `);

      assertFirstFrameContains('Foo\nInner HTML');
      toggleInspectMode({ source: 'button' });
      assertInspectOverlayInFrame();

      hoverTargetInFrame('[data-inner]');

      getInspectHighlight()
        .should('be.visible')
        .and('have.css', 'height', '80px');
    });

    it('shows the editor when panels were hidden', () => {
      loadPlayroom(`
        <Foo />
        <Bar />
      `);

      getCodeEditor().should('be.visible');
      cy.get('body').type(cmdPlus('\\'));
      getCodeEditor().should('not.be.visible');

      toggleInspectMode({ source: 'keyboard' });
      simulateInspectMessage('select', 0);

      getCodeEditor().should('be.visible');
      assertInspectModeInactive();
    });

    it('positions cursor at the selected line', () => {
      loadPlayroom(`
        <Foo />
        <Bar />
        <Foo color="red" />
      `);

      toggleInspectMode({ source: 'button' });
      simulateInspectMessage('select', 1);

      getCodeEditor().should('be.visible');

      cy.get('.CodeMirror').should(($cm) => {
        const cursor = ($cm[0] as any).CodeMirror.getCursor();
        expect(cursor.line).to.equal(1);
        expect(cursor.ch).to.equal(0);
      });
    });
  });

  describe('Hover Highlighting', () => {
    it('highlights the corresponding line in the editor', () => {
      loadPlayroom(`
        <Foo />
        <Bar />
        <Foo color="red" />
      `);

      toggleInspectMode({ source: 'button' });
      simulateInspectMessage('hover', 1);
      cy.get('.cm-inspect-highlight').should('exist');
    });

    it('removes highlight when hover line is null', () => {
      loadPlayroom(`
        <Foo />
        <Bar />
      `);

      toggleInspectMode({ source: 'button' });
      simulateInspectMessage('hover', 0);
      cy.get('.cm-inspect-highlight').should('exist');

      simulateInspectMessage('hover', null);
      cy.get('.cm-inspect-highlight').should('not.exist');
    });
  });
});
