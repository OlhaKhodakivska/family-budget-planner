import { useEffect, useMemo, useReducer } from 'react';
import type { BudgetAction, BudgetState } from '../types/budget';
import { calculateTotals, initialBudgetState, toMoneyNumber } from '../utils/budget';

const storageKey = 'family-budget-state-v2';

const reducer = (state: BudgetState, action: BudgetAction): BudgetState => {
  switch (action.type) {
    case 'ADD_INCOME':
      return { ...state, incomes: [action.payload, ...state.incomes] };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [action.payload, ...state.expenses] };
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

const getInitialState = (): BudgetState => {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return initialBudgetState;

    const parsed = JSON.parse(stored) as Partial<BudgetState>;
    return {
      incomes: Array.isArray(parsed.incomes) ? parsed.incomes : [],
      expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
      creditCards: Array.isArray(parsed.creditCards) ? parsed.creditCards : [],
      savingsBalance: toMoneyNumber(parsed.savingsBalance),
      savingsTransfers: Array.isArray(parsed.savingsTransfers) ? parsed.savingsTransfers : [],
      dreamGoals: Array.isArray(parsed.dreamGoals) ? parsed.dreamGoals : [],
    };
  } catch {
    return initialBudgetState;
  }
};

export const useBudgetStore = () => {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  const totals = useMemo(() => calculateTotals(state), [state]);

  return { state, dispatch, totals };
};
