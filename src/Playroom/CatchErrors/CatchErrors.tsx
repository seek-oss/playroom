import { Component, type ErrorInfo, type ReactNode } from 'react';

import { ErrorMessage } from '../RenderError/RenderError';

interface Props {
  code?: string;
  children: ReactNode;
}
interface State {
  invalidCode: string | null;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}
export default class CatchErrors extends Component<Props, State> {
  state: State = {
    error: null,
    invalidCode: null,
    errorInfo: null,
  };

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { code = null } = this.props;
    this.setState({ invalidCode: code, error, errorInfo });
  }

  render() {
    const { invalidCode, error, errorInfo } = this.state;
    const { code, children } = this.props;

    if (code !== invalidCode || !error) {
      return children;
    }

    // Ensure the stack only contains user-provided components
    const componentStack =
      errorInfo?.componentStack
        ?.split('\n')
        .filter((line: string) => /RenderCode/.test(line))
        .map((line: string) => line.replace(/ \(created by .*/g, '')) ?? [];

    // Ignore the RenderCode container component
    const lines = componentStack.slice(0, componentStack.length - 1);

    return (
      <ErrorMessage>
        {error.message}
        {lines.map((line, i) => (
          <span key={i}>{line}</span>
        ))}
      </ErrorMessage>
    );
  }
}
