"use client";

import { AlertCircle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  message?: string;
  onRetry?: () => void;
  backLink?: string;
  backLinkText?: string;
  children?: ReactNode;
}

/**
 * Reusable error state component
 * Shows error message with retry and navigation options
 */
export function ErrorState({
  title = "Oops! Something went wrong",
  description = "An error occurred while loading the content.",
  message,
  onRetry,
  backLink,
  backLinkText = "Go Back",
  children,
}: ErrorStateProps) {
  return (
    <div className="w-full  px-5 lg:px-40 py-20 flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-destructive/10 rounded-full p-4">
            <AlertCircle className="w-12 h-12 text-destructive" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-primary mb-2">{title}</h1>

        {/* Description */}
        <p className="text-muted-foreground mb-4">{description}</p>

        {/* Error Message (if provided) */}
        {message && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3 mb-6 text-sm text-destructive">
            {message}
          </div>
        )}

        {/* Custom content */}
        {children && <div className="mb-6">{children}</div>}

        {/* Action Buttons */}
        <div className="flex gap-3 flex-col">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          )}

          {backLink && (
            <Link
              href={backLink}
              className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              {backLinkText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Lightweight error component for inline display
 */
export function ErrorInline({
  title = "Error",
  message,
  onDismiss,
}: {
  title?: string;
  message?: string;
  onDismiss?: () => void;
}) {
  return (
    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
      <div className="flex gap-4">
        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-destructive mb-1">{title}</h3>
          {message && <p className="text-sm text-destructive/80">{message}</p>}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-destructive hover:text-destructive/80 transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Grid error state (shows error in center of grid area)
 */
export function ErrorGrid({
  title = "Failed to load items",
  description = "Unable to fetch the content.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      <div className="md:col-span-2 flex items-center justify-center py-20 px-5">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold text-primary mb-2">{title}</h2>
          <p className="text-muted-foreground mb-6">{description}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              <RotateCcw className="w-4 h-4" />
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
