import React, { useState, useMemo } from 'react';
import TableControls from './TableControls';
import Pagination from './Pagination';
import { formatColumnHeader, formatCellValue } from '../utils/formatters';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface DataTableProps {
  data: any[];
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
} | null;

export default function DataTable({
  data,
  currentPage,
  itemsPerPage,
  onPageChange,
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  const columns = useMemo(() => {
    return data.length > 0 ? Object.keys(data[0]) : [];
  }, [data]);

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return current.direction === 'asc'
          ? { key, direction: 'desc' }
          : null;
      }
      return { key, direction: 'asc' };
    });
  };

  const handleColumnFilter = (column: string, value: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [column]: value,
    }));
  };

  const filteredAndSortedData = useMemo(() => {
    let processed = [...data];

    Object.entries(columnFilters).forEach(([column, filterValue]) => {
      if (filterValue) {
        processed = processed.filter(row => 
          String(row[column]).toLowerCase().includes(filterValue.toLowerCase())
        );
      }
    });

    if (searchQuery) {
      processed = processed.filter(row =>
        Object.values(row).some(value =>
          String(value || '').toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    if (sortConfig) {
      processed.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === bValue) return 0;
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        const comparison = aValue < bValue ? -1 : 1;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    return processed;
  }, [data, searchQuery, sortConfig, columnFilters]);

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredAndSortedData.slice(startIndex, endIndex);

    return {
      totalPages,
      startIndex,
      endIndex,
      currentData,
    };
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  if (!data.length) {
    return (
      <div className="text-center py-12 text-secondary-500 dark:text-secondary-400">
        Nenhum dado disponível para esta tabela
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-white dark:bg-secondary-800 transition-colors duration-200">
      <TableControls
        onSearch={setSearchQuery}
        totalRecords={filteredAndSortedData.length}
      />
      
      <div className="overflow-hidden shadow-soft dark:shadow-soft-dark ring-1 ring-secondary-200 dark:ring-secondary-700 rounded-lg transition-all duration-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
            <thead className="bg-secondary-50 dark:bg-secondary-800">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="px-6 py-3 text-left text-sm font-semibold text-secondary-900 dark:text-secondary-100"
                  >
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handleSort(column)}
                        className="flex items-center gap-2 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        {formatColumnHeader(column)}
                        {sortConfig?.key === column && (
                          sortConfig.direction === 'asc' ? 
                            <ChevronUp className="w-4 h-4" /> : 
                            <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                      <input
                        type="text"
                        placeholder="Filtrar..."
                        className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-secondary-700 border-secondary-300 dark:border-secondary-600 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 dark:placeholder-secondary-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-colors duration-200"
                        onChange={(e) => handleColumnFilter(column, e.target.value)}
                        value={columnFilters[column] || ''}
                      />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700 bg-white dark:bg-secondary-800">
              {paginationData.currentData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors duration-200">
                  {columns.map((column) => (
                    <td
                      key={`${rowIndex}-${column}`}
                      className="whitespace-nowrap px-6 py-4 text-sm text-secondary-600 dark:text-secondary-300"
                    >
                      {formatCellValue(row[column])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={paginationData.totalPages}
          onPageChange={onPageChange}
          totalRecords={filteredAndSortedData.length}
          startIndex={paginationData.startIndex}
          endIndex={Math.min(paginationData.endIndex, filteredAndSortedData.length)}
        />
      </div>
    </div>
  );
}