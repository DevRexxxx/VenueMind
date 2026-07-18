"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`ErrorBoundary caught an error in ${this.props.fallbackName || 'a component'}:`, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center p-6 bg-red-950/20 border border-red-500/20 rounded-xl">
          <AlertTriangle className="text-red-500 mb-3" size={32} />
          <h3 className="text-red-400 font-bold mb-1 text-sm">
            {this.props.fallbackName ? `${this.props.fallbackName} Unavailable` : "Component Unavailable"}
          </h3>
          <p className="text-red-400/70 text-xs text-center max-w-xs">
            We encountered a critical error rendering this widget. The rest of the dashboard remains operational.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold rounded-lg transition-colors border border-red-500/30"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
