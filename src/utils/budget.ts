import type { BudgetState, BudgetTotals, Language } from '../types/budget';

export const incomeCategories = ['Salary', 'Gifts', 'Other income'] as const;
export const expenseCategories = ['Rent', 'Groceries', 'Cosmetics', 'Pets', 'Hobby'] as const;

export const initialBudgetState: BudgetState = {
  incomes: [],
  expenses: [],
  creditCards: [],
  savingsBalance: 0,
  savingsTransfers: [],
  dreamGoals: [],
};

export const toMoneyNumber = (value: unknown): number => {
  const parsed = typeof value === 'number' ? value : parseMoney(String(value ?? ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatCurrencyValue = (value: number, language: Language): string => {
  const amount = toMoneyNumber(value);
  const formattedAmount = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(amount)
    .replace(/\u202f/g, ' ')
    .replace(/\u00a0/g, ' ');

  return language === 'uk' ? `${formattedAmount} ₴` : `${formattedAmount} €`;
};

export const convertFromBaseCurrency = (value: number, language: Language, eurToUahRate: number | null): number => {
  const amount = toMoneyNumber(value);
  return language === 'uk' && eurToUahRate ? amount * eurToUahRate : amount;
};

export const convertToBaseCurrency = (value: number, language: Language, eurToUahRate: number | null): number => {
  const amount = toMoneyNumber(value);
  return language === 'uk' ? (eurToUahRate ? amount / eurToUahRate : Number.NaN) : amount;
};

export const formatDateValue = (value: string, language: Language): string =>
  new Date(value).toLocaleDateString(language === 'uk' ? 'uk-UA' : 'en-IE');

export const parseMoney = (value: string): number => {
  const normalized = value.trim().replace(/\s/g, '').replace(',', '.').replace(/[^\d.-]/g, '');
  return Number(normalized);
};

export const formatMoneyInput = (value: string): string => {
  const normalized = value.replace(/[^\d,.]/g, '').replace(/\./g, ',');
  const [integerRaw = '', ...decimalParts] = normalized.split(',');
  const integerDigits = integerRaw.replace(/\D/g, '');
  const decimalDigits = decimalParts.join('').replace(/\D/g, '').slice(0, 2);
  const integerPart = integerDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  if (normalized.includes(',')) {
    return `${integerPart || '0'},${decimalDigits}`;
  }

  return integerPart;
};

export const capitalizeFirstLetter = (value: string): string => {
  const index = value.search(/\S/);
  if (index === -1) return value;

  return `${value.slice(0, index)}${value.charAt(index).toLocaleUpperCase()}${value.slice(index + 1)}`;
};

export const createId = (prefix: string): string =>
  `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const calculateTotals = (state: BudgetState): BudgetTotals => {
  const totalIncome = state.incomes.reduce((sum, item) => sum + toMoneyNumber(item.amount), 0);
  const totalExpenses = state.expenses.reduce((sum, item) => sum + toMoneyNumber(item.amount), 0);
  const totalCreditLimit = state.creditCards.reduce((sum, card) => sum + toMoneyNumber(card.limit), 0);
  const totalCreditDebt = state.creditCards.reduce((sum, card) => sum + toMoneyNumber(card.debt), 0);

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    totalSavings: toMoneyNumber(state.savingsBalance),
    totalCreditLimit,
    totalCreditDebt,
    totalCreditAvailable: totalCreditLimit - totalCreditDebt,
  };
};
