import { Component, type ReactNode } from 'react';

import { ErrorMessage } from '../RenderError/RenderError';

interface Props {
  code?: string;
  children: ReactNode;
}
interface State {
  invalidCode: string | null;
  errorMessage: string | null;
}
export default class CatchErrors extends Component<Props, State> {
  state: State = {
    errorMessage: null,
    invalidCode: null,
  };

  componentDidCatch(error: Error) {
    const { code = null } = this.props;
    this.setState({ invalidCode: code, errorMessage: error.message });
  }

  render() {
    const { invalidCode, errorMessage } = this.state;
    const { code, children } = this.props;

    if (code !== invalidCode || !errorMessage) {
      return children;
    }

    return <ErrorMessage>{errorMessage}</ErrorMessage>;
  }
}
