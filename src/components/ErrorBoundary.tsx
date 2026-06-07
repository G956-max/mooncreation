import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] mb-4">Something went wrong</h2>
            <p className="text-gray-500 mb-6">
              {this.state.error?.message.includes('auth/network-request-failed') 
                ? "A network error occurred while connecting to Firebase. Please check your internet connection or disable any ad-blockers and try again."
                : "An unexpected error occurred. Please try refreshing the page."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#2C2C2C] text-white px-6 py-2 rounded-lg font-medium hover:bg-black transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
