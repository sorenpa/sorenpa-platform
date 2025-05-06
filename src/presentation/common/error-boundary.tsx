import React from "react";
import { ErrorRegion } from "../../domain";

type Props = {
  children: React.ReactNode;
  onError?: (
    error: Error,
    errorInfo: React.ErrorInfo,
    context?: { region: ErrorRegion; name?: string }
  ) => void;
  fallback?: React.ReactNode;
  region?: ErrorRegion;
  name?: string;
};

type State = { hasError: boolean; error?: Error };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError &&
      this.props.onError(error, errorInfo, {
        name: this.props.name,
        region: this.props.region || "Component",
      });
  }

  render() {
    if (this.state.hasError) {
      return <>{this.props.fallback || this.renderDefaultError()}</>;
    }

    return this.props.children;
  }

  renderDefaultError() {
    return (
      <>
        <div>Something went wrong. Please refresh or try again.</div>
      </>
    );
  }
}
