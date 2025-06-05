import dedent from 'dedent';

import {
  assertFirstFrameContains,
  assertFirstFrameError,
  typeCode,
  assertFirstFrameNoError,
  loadPlayroom,
  moveByWords,
} from '../support/utils';

describe('Handling rendering errors', () => {
  it('show error when variable does not exist', () => {
    loadPlayroom();

    typeCode('<div style={{}{{} background {}}{}}>');

    assertFirstFrameError('background is not defined');
  });

  it('show error when component does not exist', () => {
    loadPlayroom();

    typeCode('<Fake />');

    assertFirstFrameError('Fake is not defined');
  });

  it('show error over last successful render when something is undefined, then recover to latest when valid', () => {
    loadPlayroom('<Foo><Foo><Bar/></Foo></Foo>');

    typeCode(`{end}{enter}<div style={{}{{} background {}}{}}>VALID`, 150);

    assertFirstFrameContains('Foo\nFoo\nBar');
    assertFirstFrameError('background is not defined');

    moveByWords(-2);
    typeCode(`: 'blue'`, 150);

    assertFirstFrameContains('Foo\nFoo\nBar\nVALID');
    assertFirstFrameNoError();
  });

  it('show error over last successful render when component throws, then recover to latest when valid', () => {
    loadPlayroom(
      dedent`{
        void (Test = ({ valid }) => {
          if (!valid) {
            throw new Error("No \`valid\` prop provided");
          }

          return <div>VALID</div>;
        })
      }`
    );

    typeCode(`{meta+downarrow}{enter}{enter}Rendered{enter}<Test />`, 150);

    assertFirstFrameContains('Rendered');
    assertFirstFrameError('No `valid` prop provided');

    typeCode(`{leftArrow}{leftArrow}valid`, 150);

    assertFirstFrameContains('Rendered\nVALID');
    assertFirstFrameNoError();
  });
});
