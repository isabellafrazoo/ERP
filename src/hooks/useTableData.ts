import { useQuery, UseQueryResult } from 'react-query';
import { fetchTables, fetchAllData } from '../services/api';
import { TableData } from '../types/database';
import { tableNameMapping } from '../utils/tableMapping';

export function useTableData(selectedTable: string | null): TableData {
  const tablesQuery: UseQueryResult = useQuery(['tables'], fetchTables, {
    staleTime: 300000, // 5 minutes
    cacheTime: 3600000, // 1 hour
    retry: 2,
    onError: (error: Error) => {
      console.error('Failed to fetch tables:', error.message);
    }
  });

  const dataQuery: UseQueryResult = useQuery(['allData', selectedTable], fetchAllData, {
    enabled: !!selectedTable,
    staleTime: 300000,
    cacheTime: 3600000,
    retry: 2,
    onError: (error: Error) => {
      console.error('Failed to fetch data:', error.message);
    }
  });

  const getMappedTableData = (tableName: string) => {
    const mappedName = tableNameMapping[tableName];
    return dataQuery.data?.data[mappedName] || [];
  };

  return {
    tables: tablesQuery.data?.tables.map((t) => t.name) || [],
    currentTableData: selectedTable ? getMappedTableData(selectedTable) : [],
    isLoading: tablesQuery.isLoading || dataQuery.isLoading,
    isError: tablesQuery.isError || dataQuery.isError,
    refetch: () => {
      tablesQuery.refetch();
      dataQuery.refetch();
    },
  };
}