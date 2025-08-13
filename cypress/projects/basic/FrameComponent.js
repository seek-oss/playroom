import { TestContext } from './context';

export default ({ children }) => (
  <TestContext.Provider value="CONTEXT_VALUE">{children}</TestContext.Provider>
);
