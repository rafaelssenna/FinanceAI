// ==================== Enums ====================
export enum Plan {
  FREE = 'FREE',
  PRO = 'PRO',
  BUSINESS = 'BUSINESS',
}

export enum AccountType {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  INVESTMENT = 'INVESTMENT',
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
}

// ==================== Models ====================
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  currency: string;
  locale: string;
  plan: Plan;
  planExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  color: string;
  icon?: string;
  initialBalance: number;
  balance?: number; // Saldo calculado (inicial + transacoes)
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  userId?: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  isSystem: boolean;
  isActive: boolean;
}

export interface Transaction {
  id: string;
  accountId: string;
  account?: Account;
  categoryId: string;
  category?: Category;
  type: TransactionType;
  amount: number;
  description: string;
  notes?: string;
  date: string;
  aiCategorized: boolean;
  aiConfidence?: number;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  category?: Category;
  amount: number;
  month: number;
  year: number;
  alertAt: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== DTOs ====================
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface CreateAccountDto {
  name: string;
  type: AccountType;
  color?: string;
  icon?: string;
  initialBalance?: number;
}

export interface CreateTransactionDto {
  accountId: string;
  categoryId?: string;
  type: TransactionType;
  amount: number;
  description: string;
  notes?: string;
  date: string;
}

export interface FilterTransactionsDto {
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  total: number;
  percentage: number;
}

export interface BudgetProgress {
  budgetId: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  budgetAmount: number;
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
}

// ==================== Fixed Expenses ====================
export enum BillStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  SKIPPED = 'SKIPPED',
}

export interface FixedExpense {
  id: string;
  userId: string;
  categoryId: string;
  category?: Category;
  name: string;
  amount: number;
  dueDay: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PendingBill {
  id: string;
  userId: string;
  fixedExpenseId: string;
  fixedExpense?: FixedExpense;
  amount: number;
  dueDate: string;
  status: BillStatus;
  paidAt?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFixedExpenseDto {
  name: string;
  amount: number;
  dueDay: number;
  categoryId: string;
}

export interface FixedExpensesSummary {
  totalPending: number;
  totalOverdue: number;
  billsCount: number;
  overdueCount: number;
  nextBills: {
    id: string;
    name: string;
    amount: number;
    dueDate: string;
    status: BillStatus;
    category: Category;
  }[];
}
