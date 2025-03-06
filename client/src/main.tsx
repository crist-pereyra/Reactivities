import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app/layout/index.css';
import App from './app/layout/App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>
);
