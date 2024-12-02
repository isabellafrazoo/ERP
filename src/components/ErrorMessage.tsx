import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 transition-colors duration-200">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400 dark:text-red-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{message}</h3>
          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onRetry}
                className="rounded-md bg-red-50 dark:bg-red-900/30 px-3 py-2 text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Tentar novamente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}