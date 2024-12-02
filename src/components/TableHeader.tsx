import React from 'react';
import { Database, LayoutDashboard } from 'lucide-react';

interface TableHeaderProps {
  selectedTable: string | null;
  isDashboardView: boolean;
}

export default function TableHeader({ selectedTable, isDashboardView }: TableHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      {isDashboardView ? (
        <LayoutDashboard className="w-6 h-6 text-primary-400" />
      ) : (
        <Database className="w-6 h-6 text-primary-400" />
      )}
      <div>
        <h2 className="text-xl font-bold text-secondary-100">
          {isDashboardView ? 'Dashboard' : selectedTable ? `Tabela: ${selectedTable}` : 'Explorador de Dados'}
        </h2>
        {!isDashboardView && selectedTable && (
          <p className="text-sm text-secondary-400">
            Visualizando registros da tabela {selectedTable}
          </p>
        )}
      </div>
    </div>
  );
}