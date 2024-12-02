import { AxiosInstance, AxiosError } from 'axios';

const RETRY_COUNT = 3;
const RETRY_DELAY = 1000;

export function setupInterceptors(api: AxiosInstance) {
  api.interceptors.request.use(
    (config) => {
      // Add retry count to config
      config.retryCount = config.retryCount ?? 0;
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config;

      if (!config || !config.retryCount || config.retryCount >= RETRY_COUNT) {
        return Promise.reject(error);
      }

      // Increment retry count
      config.retryCount += 1;

      // Create new promise to handle retry delay
      const backoff = new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, RETRY_DELAY * config.retryCount);
      });

      // Wait for backoff delay and retry request
      await backoff;
      return api(config);
    }
  );
}