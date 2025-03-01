'use client';

import { WagmiConfig } from 'wagmi';
import { config } from './config/web3';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 创建一个新的 QueryClient 实例
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        {children}
      </WagmiConfig>
    </QueryClientProvider>
  );
} 