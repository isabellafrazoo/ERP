import React from 'react';
import { useQuery } from 'react-query';
import { Users, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import KPICard from './KPICard';
import SalesChart from './SalesChart';
import StatusPieChart from './StatusPieChart';
import FinancialChart from './FinancialChart';
import { fetchAllData } from '../../services/api';
import { calculateKPIs, processChartData } from '../../utils/dashboardUtils';

export default function DashboardLayout() {
  const { data, isLoading, isError, error } = useQuery('allData', fetchAllData, {
    refetchInterval: 300000,
    retry: 3,
    onError: (err) => {
      console.error('Dashboard data fetch error:', err);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 dark:border-primary-400" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="text-red-600 dark:text-red-400 text-lg font-medium mb-2">
          Falha ao carregar dados do dashboard
        </div>
        <div className="text-secondary-500 dark:text-secondary-400 text-sm mb-4">
          {error instanceof Error ? error.message : 'Por favor, tente novamente mais tarde'}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-secondary-900"
        >
          Recarregar
        </button>
      </div>
    );
  }

  const { activeClients, monthlyRevenue, pendingOrders, revenueChange } = calculateKPIs(data);
  const { salesData, statusData, financialData } = processChartData(data);

  return (
    <div className="p-6 space-y-6 bg-secondary-50 dark:bg-secondary-900 transition-colors duration-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Clientes Ativos"
          value={activeClients}
          icon={<Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />}
        />
        <KPICard
          title="Receita Mensal"
          value={`R$ ${monthlyRevenue.toLocaleString()}`}
          change={revenueChange}
          icon={<DollarSign className="w-6 h-6 text-primary-600 dark:text-primary-400" />}
        />
        <KPICard
          title="Pedidos Pendentes"
          value={pendingOrders}
          icon={<ShoppingCart className="w-6 h-6 text-primary-600 dark:text-primary-400" />}
        />
        <KPICard
          title="Taxa de Crescimento"
          value={`${revenueChange}%`}
          icon={<TrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg transition-colors duration-200">
          <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-4">Visão Geral de Vendas</h3>
          <div className="h-[300px]">
            <SalesChart data={salesData} />
          </div>
        </div>
        <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg transition-colors duration-200">
          <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-4">Distribuição de Status</h3>
          <div className="h-[300px] flex items-center justify-center">
            <StatusPieChart data={statusData} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg transition-colors duration-200">
        <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-4">Visão Geral Financeira</h3>
        <div className="h-[300px]">
          <FinancialChart data={financialData} />
        </div>
      </div>
    </div>
  );
}