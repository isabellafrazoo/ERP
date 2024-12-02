import { subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { safeParseDate, isInMonth } from './dateUtils';

interface FinancialTransaction {
  tipo: string;
  valor: string | number;
  data: string;
}

interface Order {
  status: string;
  data: string;
  total: string | number;
}

interface Client {
  status: string;
}

const parseAmount = (value: string | number): number => {
  if (typeof value === 'number') return value;
  const cleanValue = value.replace(/[^0-9.-]+/g, '');
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
};

export const calculateKPIs = (data: any) => {
  if (!data?.data) {
    return {
      activeClients: 0,
      monthlyRevenue: 0,
      pendingOrders: 0,
      revenueChange: 0,
    };
  }

  const currentDate = new Date();
  const lastMonth = subMonths(currentDate, 1);

  const clients = (data.data.Cliente || []) as Client[];
  const orders = (data.data.Pedido || []) as Order[];
  const financial = (data.data.Financeiro || []) as FinancialTransaction[];

  // Active Clients
  const activeClients = clients.filter(client => 
    ['active', 'ativo'].includes(client.status?.toLowerCase() || '')
  ).length;

  // Pending Orders
  const pendingOrders = orders.filter(order => 
    ['pending', 'pendente'].includes(order.status?.toLowerCase() || '')
  ).length;

  // Monthly Revenue
  const getCurrentMonthRevenue = () => {
    return financial
      .filter(transaction => {
        const date = safeParseDate(transaction.data);
        return (
          ['receita', 'revenue'].includes(transaction.tipo?.toLowerCase() || '') &&
          date && isInMonth(date, currentDate)
        );
      })
      .reduce((sum, transaction) => sum + parseAmount(transaction.valor), 0);
  };

  const getLastMonthRevenue = () => {
    return financial
      .filter(transaction => {
        const date = safeParseDate(transaction.data);
        return (
          ['receita', 'revenue'].includes(transaction.tipo?.toLowerCase() || '') &&
          date && isInMonth(date, lastMonth)
        );
      })
      .reduce((sum, transaction) => sum + parseAmount(transaction.valor), 0);
  };

  const currentMonthRevenue = getCurrentMonthRevenue();
  const lastMonthRevenue = getLastMonthRevenue();

  // Revenue Change
  const revenueChange = lastMonthRevenue > 0
    ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
    : 0;

  return {
    activeClients,
    monthlyRevenue: Math.round(currentMonthRevenue * 100) / 100,
    pendingOrders,
    revenueChange: Math.round(revenueChange * 10) / 10,
  };
};

export const processChartData = (data: any) => {
  if (!data?.data) {
    return {
      salesData: { labels: [], datasets: [] },
      statusData: { labels: [], datasets: [] },
      financialData: { labels: [], datasets: [] },
    };
  }

  const orders = (data.data.Pedido || []) as Order[];
  const financial = (data.data.Financeiro || []) as FinancialTransaction[];

  // Generate last 12 months
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), 11 - i);
    return {
      date,
      label: new Intl.DateTimeFormat('en-US', { 
        month: 'short',
        year: 'numeric'
      }).format(date)
    };
  });

  // Sales Data
  const salesData = {
    labels: months.map(m => m.label),
    datasets: [{
      label: 'Orders',
      data: months.map(month => 
        orders.filter(order => {
          const date = safeParseDate(order.data);
          return date && isInMonth(date, month.date);
        }).length
      ),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true,
    }]
  };

  // Status Distribution
  const statusMap = {
    'pending': 'Pending',
    'pendente': 'Pending',
    'active': 'Active',
    'ativo': 'Active',
    'cancelled': 'Cancelled',
    'cancelado': 'Cancelled',
    'completed': 'Completed',
    'completo': 'Completed',
  };

  const statusCounts = orders.reduce((acc: Record<string, number>, order) => {
    const normalizedStatus = statusMap[order.status?.toLowerCase() as keyof typeof statusMap] || 'Other';
    acc[normalizedStatus] = (acc[normalizedStatus] || 0) + 1;
    return acc;
  }, {});

  const statusColors = {
    'Pending': 'rgba(245, 158, 11, 0.8)',
    'Active': 'rgba(16, 185, 129, 0.8)',
    'Cancelled': 'rgba(239, 68, 68, 0.8)',
    'Completed': 'rgba(59, 130, 246, 0.8)',
    'Other': 'rgba(156, 163, 175, 0.8)',
  };

  const statusData = {
    labels: Object.keys(statusCounts),
    datasets: [{
      data: Object.values(statusCounts),
      backgroundColor: Object.keys(statusCounts).map(
        status => statusColors[status as keyof typeof statusColors]
      ),
    }]
  };

  // Financial Data
  const getMonthlyFinancials = (month: { date: Date }, type: string) => {
    return financial
      .filter(transaction => {
        const date = safeParseDate(transaction.data);
        return (
          transaction.tipo?.toLowerCase() === type.toLowerCase() &&
          date && isInMonth(date, month.date)
        );
      })
      .reduce((sum, transaction) => sum + parseAmount(transaction.valor), 0);
  };

  const financialData = {
    labels: months.map(m => m.label),
    datasets: [
      {
        label: 'Revenue',
        data: months.map(month => getMonthlyFinancials(month, 'receita')),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: months.map(month => getMonthlyFinancials(month, 'despesa')),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      }
    ]
  };

  return { salesData, statusData, financialData };
};