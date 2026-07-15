import type { BudgetAction, BudgetState } from '../types/budget';
import { toMoneyNumber } from './budget';

export const budgetReducer = (state: BudgetState, action: BudgetAction): BudgetState => {
  switch (action.type) {
    case 'ADD_INCOME':
      return { ...state, incomes: [action.payload, ...state.incomes] };
    case 'UPDATE_INCOME':
      return {
        ...state,
        incomes: state.incomes.map((entry) => (entry.id === action.payload.id ? action.payload : entry)),
      };
    case 'REMOVE_INCOME':
      return {
        ...state,
        incomes: state.incomes.filter((entry) => entry.id !== action.payload),
      };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [action.payload, ...state.expenses] };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map((entry) => (entry.id === action.payload.id ? action.payload : entry)),
      };
    case 'REMOVE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter((entry) => entry.id !== action.payload),
      };
    case 'ADD_CARD':
      return { ...state, creditCards: [action.payload, ...state.creditCards] };
    case 'REMOVE_CARD':
      return {
        ...state,
        creditCards: state.creditCards.filter((card) => card.id !== action.payload),
      };
    case 'ADD_SAVINGS_TRANSFER':
      return {
        ...state,
        savingsBalance: toMoneyNumber(state.savingsBalance) + toMoneyNumber(action.payload.amount),
        savingsTransfers: [action.payload, ...state.savingsTransfers],
      };
    case 'ADD_DREAM_GOAL':
      return { ...state, dreamGoals: [action.payload, ...state.dreamGoals] };
    case 'UPDATE_DREAM_GOAL':
      return {
        ...state,
        dreamGoals: state.dreamGoals.map((goal) => (goal.id === action.payload.id ? action.payload : goal)),
      };
    case 'REMOVE_DREAM_GOAL':
      return {
        ...state,
        dreamGoals: state.dreamGoals.filter((goal) => goal.id !== action.payload),
      };
    case 'HYDRATE':
      return action.payload;
    default:
      return state;
  }
};
