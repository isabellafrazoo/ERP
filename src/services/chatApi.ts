import axios, { AxiosError } from 'axios';
import { setupInterceptors } from './interceptors';

interface ChatMessage {
  query: string;
  conversationId?: string;
  visitorId?: string;
  contact?: {
    firstName?: string;
    email?: string;
    phoneNumber?: string;
  };
}

interface ChatResponse {
  success: boolean;
  data?: {
    answer: string;
    additionalData?: Record<string, unknown>;
  };
  error?: string;
}

const chatApi = axios.create({
  baseURL: 'https://www.aryes.xyz',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Setup interceptors for retry logic and error handling
setupInterceptors(chatApi);

export const sendMessage = async (message: string): Promise<ChatResponse> => {
  try {
    const payload: ChatMessage = {
      query: message,
      conversationId: localStorage.getItem('conversationId') || 'default-conversation',
      visitorId: localStorage.getItem('visitorId') || `visitor-${Date.now()}`,
      contact: {}
    };

    const response = await chatApi.post<ChatResponse>('/volt', payload);

    // Store conversation and visitor IDs if they're returned by the server
    if (response.data?.data?.additionalData?.conversationId) {
      localStorage.setItem('conversationId', response.data.data.additionalData.conversationId as string);
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Chat API Error:', error.message);
      
      // Handle specific error cases
      if (error.code === 'ECONNABORTED') {
        return {
          success: false,
          error: 'A conexão expirou. Por favor, tente novamente.'
        };
      }
      
      if (!error.response) {
        return {
          success: false,
          error: 'Erro de conexão. Verifique sua internet e tente novamente.'
        };
      }

      // Handle specific HTTP status codes
      switch (error.response.status) {
        case 429:
          return {
            success: false,
            error: 'Muitas requisições. Por favor, aguarde um momento e tente novamente.'
          };
        case 503:
          return {
            success: false,
            error: 'Serviço temporariamente indisponível. Tente novamente em alguns instantes.'
          };
        default:
          return {
            success: false,
            error: `Falha ao enviar mensagem: ${error.message}`
          };
      }
    }

    return {
      success: false,
      error: 'Ocorreu um erro inesperado. Por favor, tente novamente.'
    };
  }
};