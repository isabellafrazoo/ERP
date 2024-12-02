import React from 'react';
import { Search, RefreshCw } from 'lucide-react';

interface TableControlsProps {
  onSearch: (query: string) => void;
  totalRecords: number;
  onRefresh?: () => void;
}

export default function TableControls({ onSearch, totalRecords, onRefresh }: TableControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="relative flex-1 max-w-md w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-secondary-400 dark:text-secondary-500" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg leading-5 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 dark:placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-colors duration-200"
          placeholder="Pesquisar em todas as colunas..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-4">
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center px-3 py-2 border border-secondary-300 dark:border-secondary-600 shadow-soft dark:shadow-soft-dark text-sm font-medium rounded-lg text-secondary-700 dark:text-secondary-200 bg-white dark:bg-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </button>
        )}
        <div className="text-sm text-secondary-600 dark:text-secondary-300">
          Total de Registros: <span className="font-medium">{totalRecords}</span>
        </div>
      </div>
    </div>
  );
}