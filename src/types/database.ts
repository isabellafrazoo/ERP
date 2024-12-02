export interface Table {
  name: string;
}

export interface TablesResponse {
  success: boolean;
  tables: Table[];
}

export interface DatabaseResponse {
  success: boolean;
  data: Record<string, any[]>;
}

export interface TableData {
  tables: string[];
  currentTableData: any[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export interface ErrorState {
  isError: boolean;
  message: string;
}