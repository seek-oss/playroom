import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Text } from '../Text/Text';
import { Strong } from '../Strong/Strong';

import * as styles from './CatchErrors.css';

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
    const componentStack = errorInfo
      ? errorInfo.componentStack
          .split('\n')
          .filter((line: string) => /RenderCode/.test(line))
          .map((line: string) => line.replace(/ \(created by .*/g, ''))
      : [];

    // Ignore the RenderCode container component
    const lines = componentStack.slice(0, componentStack.length - 1);

    return (
      <div className={styles.root}>
        <Text size="large" tone="critical">
          <Strong>{error.message}</Strong>
          {lines.map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </Text>
      </div>
    );
  }
}
