'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { FixedExpense, PendingBill, CreateFixedExpenseDto, FixedExpensesSummary } from '@/types';

// Lista todas as despesas fixas
export function useFixedExpenses() {
  return useQuery<FixedExpense[]>({
    queryKey: ['fixed-expenses'],
    queryFn: () => api.getFixedExpenses(),
  });
}

// Busca uma despesa fixa específica
export function useFixedExpense(id: string) {
  return useQuery<FixedExpense>({
    queryKey: ['fixed-expenses', id],
    queryFn: () => api.getFixedExpense(id),
    enabled: !!id,
  });
}

// Lista contas pendentes
export function usePendingBills() {
  return useQuery<PendingBill[]>({
    queryKey: ['pending-bills'],
    queryFn: () => api.getPendingBills(),
  });
}

// Resumo das despesas fixas para o dashboard
export function useFixedExpensesSummary() {
  return useQuery<FixedExpensesSummary>({
    queryKey: ['fixed-expenses-summary'],
    queryFn: () => api.getFixedExpensesSummary(),
  });
}

// Cria nova despesa fixa
export function useCreateFixedExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFixedExpenseDto) => api.createFixedExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixed-expenses'] });
      queryClient.invalidateQueries({ queryKey: ['pending-bills'] });
      queryClient.invalidateQueries({ queryKey: ['fixed-expenses-summary'] });
    },
  });
}

// Atualiza despesa fixa
export function useUpdateFixedExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateFixedExpenseDto> }) =>
      api.updateFixedExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixed-expenses'] });
      queryClient.invalidateQueries({ queryKey: ['pending-bills'] });
      queryClient.invalidateQueries({ queryKey: ['fixed-expenses-summary'] });
    },
  });
}

// Deleta despesa fixa
export function useDeleteFixedExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteFixedExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixed-expenses'] });
      queryClient.invalidateQueries({ queryKey: ['pending-bills'] });
      queryClient.invalidateQueries({ queryKey: ['fixed-expenses-summary'] });
    },
  });
}

// Paga uma conta pendente
export function usePayBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (billId: string) => api.payBill(billId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-bills'] });
      queryClient.invalidateQueries({ queryKey: ['fixed-expenses-summary'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}

// Pula uma conta pendente
export function useSkipBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (billId: string) => api.skipBill(billId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-bills'] });
      queryClient.invalidateQueries({ queryKey: ['fixed-expenses-summary'] });
    },
  });
}
