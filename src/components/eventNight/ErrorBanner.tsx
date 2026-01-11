// src/components/eventNight/ErrorBanner.tsx
import React from 'react';

export interface ErrorBannerProps {
  message?: string;
  className?: string;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, className = '' }) =>
  message ? <div className={`text-sm text-red-600 mt-2 ${className}`}>{message}</div> : null;

export default ErrorBanner;
