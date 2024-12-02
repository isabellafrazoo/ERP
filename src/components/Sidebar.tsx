import React from 'react';
import { Database, LayoutDashboard } from 'lucide-react';
import { formatTableName } from '../utils/formatters';

interface SidebarProps {
  tables: string[];
  selectedTable: string | null;
  onSelectTable: (table: string) => void;
  onDashboardClick: () => void;
  isDashboardActive: boolean;
}

export default function Sidebar({ 
  tables, 
  selectedTable, 
  onSelectTable,
  onDashboardClick,
  isDashboardActive
}: SidebarProps) {
  return (
    <div className="w-64 bg-secondary-800 min-h-screen p-4 shadow-lg">
      <div className="flex items-center gap-2 mb-8 pt-14">
        <Database className="w-6 h-6 text-primary-400" />
        <h1 className="text-xl font-bold text-white">Explorador de Dados</h1>
      </div>
      <nav className="space-y-6">
        <div>
          <button
            onClick={onDashboardClick}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              isDashboardActive
                ? 'bg-primary-600 text-white shadow-soft'
                : 'text-secondary-300 hover:bg-secondary-700'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
        </div>
        <div>
          <div className="px-4 text-sm font-medium text-secondary-400 uppercase mb-2">
            Tabelas
          </div>
          <div className="space-y-1">
            {tables.map((table) => (
              <button
                key={table}
                onClick={() => onSelectTable(table)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  selectedTable === table
                    ? 'bg-primary-600 text-white shadow-soft'
                    : 'text-secondary-300 hover:bg-secondary-700'
                }`}
              >
                {formatTableName(table)}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}