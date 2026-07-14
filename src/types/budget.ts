export type Theme = 'light' | 'dark';

export type Language = 'en' | 'uk';

export type EntryKind = 'income' | 'expense';

export type DashboardSection = 'overview' | 'income' | 'expenses' | 'cards' | 'savings' | 'dreams';

export interface BudgetEntry {
  id: string;
  category: string;
  label: string;
  amount: number;
  date: string;
}

export interface CreditCard {
  id: string;
  name: string;
  limit: number;
  debt: number;
}

export interface SavingsTransfer {
  id: string;
  label: string;
  amount: number;
  date: string;
}

export interface DreamStep {
  id: string;
  text: string;
  cost: number;
}

export interface DreamGoal {
  id: string;
  title: string;
  note: string;
  steps: DreamStep[];
  createdAt: string;
}

export interface BudgetState {
  incomes: BudgetEntry[];
  expenses: BudgetEntry[];
  creditCards: CreditCard[];
  savingsBalance: number;
  savingsTransfers: SavingsTransfer[];
  dreamGoals: DreamGoal[];
}

export interface BudgetTotals {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  totalSavings: number;
  totalCreditLimit: number;
  totalCreditDebt: number;
  totalCreditAvailable: number;
}

export type BudgetAction =
  | { type: 'ADD_INCOME'; payload: BudgetEntry }
  | { type: 'ADD_EXPENSE'; payload: BudgetEntry }
  | { type: 'ADD_CARD'; payload: CreditCard }
  | { type: 'REMOVE_CARD'; payload: string }
  | { type: 'ADD_SAVINGS_TRANSFER'; payload: SavingsTransfer }
  | { type: 'ADD_DREAM_GOAL'; payload: DreamGoal }
  | { type: 'REMOVE_DREAM_GOAL'; payload: string }
  | { type: 'HYDRATE'; payload: BudgetState };
