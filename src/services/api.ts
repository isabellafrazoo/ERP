import axios, { AxiosError } from 'axios';
import { TablesResponse, DatabaseResponse } from '../types/database';

const api = axios.create({
  baseURL: 'https://www.aryes.xyz/databa',
  timeout: 10000,
});

export const fetchTables = async (): Promise<TablesResponse> => {
  try {
    const response = await api.get<TablesResponse>('/tables');
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Failed to fetch tables: ${error.message}`);
    }
    throw error;
  }
};

export const fetchAllData = async (): Promise<DatabaseResponse> => {
  try {
    const response = await api.get<DatabaseResponse>('/all-data');
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
    throw error;
  }
};