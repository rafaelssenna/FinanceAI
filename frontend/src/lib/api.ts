const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    // Handle empty responses
    const text = await response.text();
    if (!text) return {} as T;

    return JSON.parse(text);
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request<{ accessToken: string; user: import('@/types').User }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', data.accessToken);
    }
    return data;
  }

  async register(email: string, password: string, name: string) {
    const data = await this.request<{ accessToken: string; user: import('@/types').User }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      }
    );
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', data.accessToken);
    }
    return data;
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
  }

  // Users
  async getProfile() {
    return this.request<import('@/types').User>('/users/me');
  }

  async updateProfile(data: { name?: string; avatar?: string; currency?: string }) {
    return this.request<import('@/types').User>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Accounts
  async getAccounts() {
    return this.request<import('@/types').Account[]>('/accounts');
  }

  async getAccount(id: string) {
    return this.request<import('@/types').Account>(`/accounts/${id}`);
  }

  async getTotalBalance() {
    return this.request<{ balance: number }>('/accounts/balance');
  }

  async createAccount(data: import('@/types').CreateAccountDto) {
    return this.request<import('@/types').Account>('/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAccount(id: string, data: Partial<import('@/types').CreateAccountDto>) {
    return this.request<import('@/types').Account>(`/accounts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteAccount(id: string) {
    return this.request<void>(`/accounts/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories
  async getCategories(type?: import('@/types').TransactionType) {
    const params = type ? `?type=${type}` : '';
    return this.request<import('@/types').Category[]>(`/categories${params}`);
  }

  async createCategory(data: { name: string; icon: string; color: string; type: import('@/types').TransactionType }) {
    return this.request<import('@/types').Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Transactions
  async getTransactions(filters?: import('@/types').FilterTransactionsDto) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<import('@/types').Transaction[]>(`/transactions${query}`);
  }

  async getTransaction(id: string) {
    return this.request<import('@/types').Transaction>(`/transactions/${id}`);
  }

  async getTransactionSummary(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<import('@/types').TransactionSummary>(`/transactions/summary${query}`);
  }

  async getTransactionsByCategory(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<import('@/types').CategorySummary[]>(`/transactions/by-category${query}`);
  }

  async createTransaction(data: import('@/types').CreateTransactionDto) {
    return this.request<import('@/types').Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTransaction(id: string, data: Partial<import('@/types').CreateTransactionDto>) {
    return this.request<import('@/types').Transaction>(`/transactions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteTransaction(id: string) {
    return this.request<void>(`/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  // Budgets
  async getBudgets() {
    return this.request<import('@/types').Budget[]>('/budgets');
  }

  async getBudgetProgress(month?: number, year?: number) {
    const params = new URLSearchParams();
    if (month) params.append('month', String(month));
    if (year) params.append('year', String(year));
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<import('@/types').BudgetProgress[]>(`/budgets/progress${query}`);
  }

  async createBudget(data: { categoryId: string; amount: number; month: number; year: number; alertAt?: number }) {
    return this.request<import('@/types').Budget>('/budgets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBudget(id: string, data: { amount?: number; alertAt?: number }) {
    return this.request<import('@/types').Budget>(`/budgets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteBudget(id: string) {
    return this.request<void>(`/budgets/${id}`, {
      method: 'DELETE',
    });
  }

  // AI
  async getInsights() {
    return this.request<{ insights: string }>('/ai/insights');
  }

  async suggestCategory(description: string, type: import('@/types').TransactionType) {
    return this.request<{ suggestion: string | null }>('/ai/suggest-category', {
      method: 'POST',
      body: JSON.stringify({ description, type }),
    });
  }

  // Income Config
  async setIncomeConfig(data: {
    frequency: string;
    amount: number;
    accountId?: string; // Agora é opcional
    monthlyType?: string;
    businessDay?: number;
    fixedDay?: number;
    biweeklyType?: string;
    advanceDay?: number;
    salaryBusinessDay?: number;
    day1?: number;
    day2?: number;
    weekDay?: string;
  }) {
    return this.request<any>('/users/income-config', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getIncomeConfig() {
    return this.request<any>('/users/income-config');
  }

  // Income (pending)
  async getIncomeSummary() {
    return this.request<any>('/income/summary');
  }

  async getPendingIncomes() {
    return this.request<any[]>('/income/pending');
  }

  async confirmIncome(id: string) {
    return this.request<any>(`/income/${id}/confirm`, {
      method: 'POST',
    });
  }

  async skipIncome(id: string) {
    return this.request<any>(`/income/${id}/skip`, {
      method: 'POST',
    });
  }

  // Fixed Expenses (Contas Fixas)
  async getFixedExpenses() {
    return this.request<import('@/types').FixedExpense[]>('/fixed-expenses');
  }

  async getFixedExpense(id: string) {
    return this.request<import('@/types').FixedExpense>(`/fixed-expenses/${id}`);
  }

  async createFixedExpense(data: import('@/types').CreateFixedExpenseDto) {
    return this.request<import('@/types').FixedExpense>('/fixed-expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateFixedExpense(id: string, data: Partial<import('@/types').CreateFixedExpenseDto>) {
    return this.request<import('@/types').FixedExpense>(`/fixed-expenses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteFixedExpense(id: string) {
    return this.request<void>(`/fixed-expenses/${id}`, {
      method: 'DELETE',
    });
  }

  async getPendingBills() {
    return this.request<import('@/types').PendingBill[]>('/fixed-expenses/pending');
  }

  async getFixedExpensesSummary() {
    return this.request<import('@/types').FixedExpensesSummary>('/fixed-expenses/summary');
  }

  async payBill(billId: string) {
    return this.request<any>(`/fixed-expenses/bills/${billId}/pay`, {
      method: 'POST',
    });
  }

  async skipBill(billId: string) {
    return this.request<void>(`/fixed-expenses/bills/${billId}/skip`, {
      method: 'POST',
    });
  }
}

export const api = new ApiClient(API_URL);
