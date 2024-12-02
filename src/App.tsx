import React, { useState } from 'react';
import { Loader2, PanelLeftClose, PanelLeftOpen, LayoutDashboard, Database, X, Moon, Sun } from 'lucide-react';
import Sidebar from './components/Sidebar';
import DataTable from './components/DataTable';
import ErrorMessage from './components/ErrorMessage';
import TableHeader from './components/TableHeader';
import ChatPanel from './components/Chat/ChatPanel';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import { useTableData } from './hooks/useTableData';
import { useDarkMode } from './hooks/useDarkMode';
import { useLayout } from './hooks/useLayout';

function App() {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDashboardView, setIsDashboardView] = useState(true);
  const [isDataPanelOpen, setIsDataPanelOpen] = useState(false);
  const [isDark, setIsDark] = useDarkMode();
  const { contentHeight, headerHeight } = useLayout();
  const itemsPerPage = 10;

  const { tables, currentTableData, isLoading, isError, refetch } = useTableData(selectedTable);

  const handleTableSelect = (table: string) => {
    setSelectedTable(table);
    setCurrentPage(1);
    setIsDashboardView(false);
    setIsDataPanelOpen(true);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500 dark:text-primary-400" />
        </div>
      );
    }

    if (isError) {
      return (
        <ErrorMessage
          message="Erro ao carregar dados. Por favor, verifique sua conexão e tente novamente."
          onRetry={refetch}
        />
      );
    }

    if (isDashboardView) {
      return <DashboardLayout />;
    }

    if (!selectedTable) {
      return (
        <div className="flex items-center justify-center h-full text-secondary-500 dark:text-secondary-400">
          Selecione uma tabela para visualizar seus dados
        </div>
      );
    }

    return (
      <DataTable
        data={currentTableData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    );
  };

  return (
    <div className="flex min-h-screen bg-secondary-50 dark:bg-secondary-900 transition-colors duration-200">
      {/* Sidebar Toggle Button - Always Visible */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed top-4 left-4 z-50 p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors bg-secondary-800 dark:bg-secondary-900 ${
          isSidebarOpen ? 'translate-x-64' : ''
        }`}
        title={isSidebarOpen ? "Fechar menu" : "Abrir menu"}
      >
        {isSidebarOpen ? (
          <PanelLeftClose className="w-6 h-6 text-secondary-100" />
        ) : (
          <PanelLeftOpen className="w-6 h-6 text-secondary-100" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
        style={{ height: `${contentHeight + headerHeight}px` }}
      >
        <Sidebar
          tables={tables}
          selectedTable={selectedTable}
          onSelectTable={handleTableSelect}
          onDashboardClick={() => {
            setIsDashboardView(true);
            setIsDataPanelOpen(true);
          }}
          isDashboardActive={isDashboardView}
        />
      </div>

      {/* Main Content */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : ''}`}
        style={{ minHeight: `${contentHeight + headerHeight}px` }}
      >
        {/* Top Navigation */}
        <div 
          className="bg-secondary-800 dark:bg-secondary-900 flex items-center px-16 justify-between transition-colors duration-200 fixed top-0 right-0 left-0 z-30"
          style={{ height: `${headerHeight}px` }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDataPanelOpen(!isDataPanelOpen)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary-700 dark:hover:bg-secondary-800 transition-colors"
              title={isDataPanelOpen ? "Fechar painel" : "Abrir painel"}
            >
              {isDashboardView ? (
                <LayoutDashboard className="w-6 h-6 text-secondary-100" />
              ) : (
                <Database className="w-6 h-6 text-secondary-100" />
              )}
              <span className="font-medium text-secondary-100">
                {isDashboardView ? 'Dashboard' : selectedTable ? `Tabela: ${selectedTable}` : 'Banco de Dados'}
              </span>
            </button>
          </div>
          
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg hover:bg-secondary-700 dark:hover:bg-secondary-800 transition-colors"
            title={isDark ? "Modo claro" : "Modo escuro"}
          >
            {isDark ? (
              <Sun className="w-6 h-6 text-secondary-100" />
            ) : (
              <Moon className="w-6 h-6 text-secondary-100" />
            )}
          </button>
        </div>

        {/* Content Area */}
        <div 
          className="flex-1 flex overflow-hidden"
          style={{ marginTop: `${headerHeight}px`, height: `${contentHeight}px` }}
        >
          {/* Chat Panel - Central */}
          <div 
            className={`flex-1 transition-all duration-300 ${
              isDataPanelOpen ? 'lg:mr-[60%]' : ''
            }`}
            style={{ height: `${contentHeight}px` }}
          >
            <ChatPanel />
          </div>

          {/* Data Panel - Sliding */}
          <div
            className={`fixed right-0 w-full lg:w-[60%] bg-secondary-800 dark:bg-secondary-900 transform transition-all duration-300 ease-in-out ${
              isDataPanelOpen ? 'translate-x-0' : 'translate-x-full'
            } flex flex-col`}
            style={{ 
              top: `${headerHeight}px`,
              height: `${contentHeight}px`
            }}
          >
            <div className="flex-none p-4 border-b border-secondary-700 flex justify-between items-center bg-secondary-800 dark:bg-secondary-900 transition-colors duration-200">
              <TableHeader
                selectedTable={selectedTable}
                isDashboardView={isDashboardView}
              />
              <button
                onClick={() => setIsDataPanelOpen(false)}
                className="p-2 hover:bg-secondary-700 dark:hover:bg-secondary-800 rounded-lg transition-colors"
                title="Fechar painel"
              >
                <X className="w-5 h-5 text-secondary-100" />
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;