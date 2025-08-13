import { useContext } from 'react';

import { TestContext } from './context';

export default () => {
  const testContext = useContext(TestContext);

  return {
    hello: () => 'HELLO',
    world: () => 'WORLD',
    contextValue: testContext,
  };
};
