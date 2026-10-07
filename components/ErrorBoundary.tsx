"use client";

import { Component, ReactNode } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error) {
    console.error("[TableShift] Uncaught error:", error);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: "" });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <div className="rounded-lg border border-hairline bg-surface-card p-8 max-w-[520px]">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-surface-strong text-error">
              <AlertTriangle size={20} />
            </div>
            <h2 className="mb-2 text-[20px] font-semibold text-ink">
              Something went wrong
            </h2>
            <p className="mb-1 text-sm leading-[1.5] text-body">
              The converter ran into an unexpected error. Your data has not
              been uploaded or stored anywhere.
            </p>
            {this.state.message && (
              <p className="mt-3 rounded-md bg-canvas-soft px-3 py-2 font-mono text-[12px] text-muted">
                {this.state.message}
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={this.handleReset}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-active transition-colors cursor-pointer"
              >
                Try again
              </button>
              <Link
                href="/"
                className="rounded-md border border-hairline-strong px-4 py-2 text-sm font-medium text-body hover:text-ink transition-colors"
              >
                Go home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}