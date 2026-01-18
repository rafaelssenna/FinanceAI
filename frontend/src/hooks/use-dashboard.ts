import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useTotalBalance() {
  return useQuery({
    queryKey: ['balance'],
    queryFn: () => api.getTotalBalance(),
  });
}

export function useTransactionSummary(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['transactions', 'summary', startDate, endDate],
    queryFn: () => api.getTransactionSummary(startDate, endDate),
  });
}

export function useTransactionsByCategory(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['transactions', 'by-category', startDate, endDate],
    queryFn: () => api.getTransactionsByCategory(startDate, endDate),
  });
}

export function useRecentTransactions() {
  return useQuery({
    queryKey: ['transactions', 'recent'],
    queryFn: () => api.getTransactions({ limit: 5 }),
  });
}

export function useBudgetProgress(month?: number, year?: number) {
  return useQuery({
    queryKey: ['budgets', 'progress', month, year],
    queryFn: () => api.getBudgetProgress(month, year),
  });
}

export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => api.getAccounts(),
  });
}

export function useInsights() {
  return useQuery({
    queryKey: ['insights'],
    queryFn: () => api.getInsights(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
