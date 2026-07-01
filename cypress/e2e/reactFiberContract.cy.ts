import {
  assertFirstFrameContains,
  getFirstFrameBody,
  loadPlayroom,
  typeCode,
} from '../support/utils';

describe('React Fiber Contract', () => {
  beforeEach(() => {
    loadPlayroom();
    typeCode('<Foo /><div data-testid="fiber-test">hello');
    assertFirstFrameContains('Foo\nhello');
  });

  it('exposes __reactFiber$ on host elements rendered by custom components', () => {
    getFirstFrameBody()
      .find('[data-testid="foo-component"]')
      .should(($el) => {
        const fiberKey = Object.keys($el[0]).find((k) =>
          k.startsWith('__reactFiber$')
        );

        expect(
          fiberKey,
          'Expected __reactFiber$ property on DOM element rendered by a custom component. ' +
            "Playroom's Inspect Element feature depends on this React internal to walk the fiber tree. " +
            'If this fails after a React upgrade, update getFiberKey() in src/components/Frame/InspectOverlay.tsx.'
        ).to.not.equal(undefined);
      });
  });

  it('exposes __reactFiber$ on standard host elements', () => {
    getFirstFrameBody()
      .find('[data-testid="fiber-test"]')
      .should(($el) => {
        const fiberKey = Object.keys($el[0]).find((k) =>
          k.startsWith('__reactFiber$')
        );

        expect(
          fiberKey,
          'Expected __reactFiber$ property on a standard <div> element. ' +
            "Playroom's Inspect Element feature depends on this React internal to walk the fiber tree. " +
            'If this fails after a React upgrade, update getFiberKey() in src/components/Frame/InspectOverlay.tsx.'
        ).to.not.equal(undefined);
      });
  });

  it('fiber node has the shape Playroom depends on (memoizedProps, return)', () => {
    getFirstFrameBody()
      .find('[data-testid="fiber-test"]')
      .should(($el) => {
        const element: Record<string, unknown> = $el[0] as never;
        const fiberKey = Object.keys(element).find((k) =>
          k.startsWith('__reactFiber$')
        );

        expect(fiberKey, 'Expected __reactFiber$ key to exist').to.be.a(
          'string'
        );

        const fiber = element[fiberKey as string] as Record<string, unknown>;

        expect(fiber, 'Fiber node must be a non-null object').to.not.equal(
          null
        );
        expect(fiber, 'Fiber node must be a non-null object').to.be.an(
          'object'
        );

        expect(
          fiber,
          'Fiber node must have memoizedProps (used to read data-playroomline)'
        ).to.have.property('memoizedProps');

        expect(
          fiber,
          'Fiber node must have return (used to walk up the fiber tree)'
        ).to.have.property('return');
      });
  });
});
