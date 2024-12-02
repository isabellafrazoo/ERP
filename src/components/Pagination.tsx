import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalRecords: number;
  startIndex: number;
  endIndex: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalRecords,
  startIndex,
  endIndex,
}: PaginationProps) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pageNumbers.slice(
    Math.max(0, currentPage - 2),
    Math.min(totalPages, currentPage + 1)
  );

  return (
    <div className="flex items-center justify-between bg-white dark:bg-secondary-800 px-4 py-3 border-t border-secondary-200 dark:border-secondary-700 transition-colors duration-200">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-secondary-300 dark:border-secondary-600 text-sm font-medium rounded-md text-secondary-700 dark:text-secondary-200 bg-white dark:bg-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Anterior
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center px-4 py-2 border border-secondary-300 dark:border-secondary-600 text-sm font-medium rounded-md text-secondary-700 dark:text-secondary-200 bg-white dark:bg-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Próximo
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-secondary-700 dark:text-secondary-200">
            Mostrando <span className="font-medium">{startIndex + 1}</span> até{' '}
            <span className="font-medium">{endIndex}</span> de{' '}
            <span className="font-medium">{totalRecords}</span> resultados
          </p>
        </div>
        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Paginação">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-secondary-400 dark:text-secondary-500 ring-1 ring-inset ring-secondary-300 dark:ring-secondary-600 hover:bg-secondary-50 dark:hover:bg-secondary-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <span className="sr-only">Anterior</span>
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          {currentPage > 3 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-secondary-900 dark:text-secondary-100 ring-1 ring-inset ring-secondary-300 dark:ring-secondary-600 hover:bg-secondary-50 dark:hover:bg-secondary-700 focus:z-20 focus:outline-offset-0 transition-colors duration-200"
              >
                1
              </button>
              {currentPage > 4 && (
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-secondary-700 dark:text-secondary-200 ring-1 ring-inset ring-secondary-300 dark:ring-secondary-600 transition-colors duration-200">
                  ...
                </span>
              )}
            </>
          )}

          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                currentPage === page
                  ? 'z-10 bg-primary-600 dark:bg-primary-500 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:focus-visible:outline-primary-500'
                  : 'text-secondary-900 dark:text-secondary-100 ring-1 ring-inset ring-secondary-300 dark:ring-secondary-600 hover:bg-secondary-50 dark:hover:bg-secondary-700 focus:z-20 focus:outline-offset-0'
              } transition-colors duration-200`}
            >
              {page}
            </button>
          ))}

          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && (
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-secondary-700 dark:text-secondary-200 ring-1 ring-inset ring-secondary-300 dark:ring-secondary-600 transition-colors duration-200">
                  ...
                </span>
              )}
              <button
                onClick={() => onPageChange(totalPages)}
                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-secondary-900 dark:text-secondary-100 ring-1 ring-inset ring-secondary-300 dark:ring-secondary-600 hover:bg-secondary-50 dark:hover:bg-secondary-700 focus:z-20 focus:outline-offset-0 transition-colors duration-200"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-secondary-400 dark:text-secondary-500 ring-1 ring-inset ring-secondary-300 dark:ring-secondary-600 hover:bg-secondary-50 dark:hover:bg-secondary-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <span className="sr-only">Próximo</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </nav>
      </div>
    </div>
  );
}