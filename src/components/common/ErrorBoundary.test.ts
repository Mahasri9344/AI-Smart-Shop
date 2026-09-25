import { describe, it, expect, vi } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';

describe('ErrorBoundary Component Logic', () => {
  it('should initialize with hasError set to false', () => {
    const boundary = new ErrorBoundary({ children: 'Child Content' });
    expect(boundary.state.hasError).toBe(false);
    expect(boundary.state.error).toBeNull();
  });

  it('should update state when getDerivedStateFromError is called', () => {
    const testError = new Error('Test rendering crash');
    const newState = ErrorBoundary.getDerivedStateFromError(testError);

    expect(newState.hasError).toBe(true);
    expect(newState.error).toBe(testError);
  });

  it('should invoke onReset callback and reset error state when resetErrorBoundary is called', () => {
    const onResetMock = vi.fn();
    const boundary = new ErrorBoundary({ children: 'Child Content', onReset: onResetMock });

    // Mock setState behavior for unmounted test instance
    boundary.setState = vi.fn((updater) => {
      const nextState = typeof updater === 'function' ? updater(boundary.state) : updater;
      boundary.state = { ...boundary.state, ...nextState };
    });

    // Set instance to error state
    boundary.state = {
      hasError: true,
      error: new Error('Fatal error'),
      errorInfo: null
    };

    // Trigger reset
    boundary.resetErrorBoundary();

    expect(boundary.state.hasError).toBe(false);
    expect(boundary.state.error).toBeNull();
    expect(onResetMock).toHaveBeenCalledTimes(1);
  });
});
