import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface PendingIncome {
  id: string;
  amount: number;
  expectedDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'SKIPPED';
}

interface IncomeSummary {
  monthlyIncome: number;
  frequency: string;
  nextPaymentDate: string | null;
  pendingIncomes: PendingIncome[];
}

export function useIncomeSummary() {
  return useQuery<IncomeSummary | null>({
    queryKey: ['income-summary'],
    queryFn: () => api.getIncomeSummary(),
  });
}

export function usePendingIncomes() {
  return useQuery<PendingIncome[]>({
    queryKey: ['pending-incomes'],
    queryFn: () => api.getPendingIncomes(),
  });
}

export function useConfirmIncome() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.confirmIncome(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income-summary'] });
      queryClient.invalidateQueries({ queryKey: ['pending-incomes'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useSkipIncome() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.skipIncome(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income-summary'] });
      queryClient.invalidateQueries({ queryKey: ['pending-incomes'] });
    },
  });
}
