import { BasicContext } from './context';

export default ({ children }) => (
  <BasicContext.Provider value="CONTEXT_VALUE">
    {children}
  </BasicContext.Provider>
);
