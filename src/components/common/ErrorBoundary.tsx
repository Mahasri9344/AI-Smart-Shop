import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((props: { error: Error | null; resetErrorBoundary: () => void }) => ReactNode);
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Reusable React Class-Based Error Boundary Component.
 * 
 * Architecture & Purpose:
 * Catches unhandled JavaScript rendering errors thrown anywhere in child component trees.
 * Suppresses white-screen crashes by rendering a fallback UI and capturing error diagnostics.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  /**
   * Static Lifecycle Hook: Invoked when a descendant component throws an unhandled error during rendering.
   * Updates state to trigger fallback UI rendering synchronously.
   */
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  /**
   * Lifecycle Hook: Logs uncaught error trace details for developer diagnostics.
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React Component Tree:', error, errorInfo);
    this.setState({ errorInfo });
  }

  /**
   * Resets the Error Boundary state to attempt component recovery without full page reload.
   */
  public resetErrorBoundary = () => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  public render() {
    if (this.state.hasError) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback({
          error: this.state.error,
          resetErrorBoundary: this.resetErrorBoundary,
        });
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div 
          className="card" 
          style={{
            maxWidth: '560px',
            margin: '3rem auto',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            backgroundColor: '#ffffff'
          }}
        >
          <div 
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}
          >
            <AlertTriangle size={32} />
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Something went wrong
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            An unexpected error occurred while rendering this component. You can try recovering or returning to the dashboard.
          </p>

          {this.state.error && (
            <div 
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                fontSize: '0.82rem',
                color: '#475569',
                textAlign: 'left',
                marginBottom: '1.5rem',
                fontFamily: 'monospace',
                overflowX: 'auto',
                maxHeight: '120px'
              }}
            >
              <strong>Error:</strong> {this.state.error.message || String(this.state.error)}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={this.resetErrorBoundary}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <RefreshCw size={16} />
              <span>Try Again</span>
            </button>

            <button
              type="button"
              onClick={() => { window.location.href = '/'; }}
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Home size={16} />
              <span>Go to Home</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
