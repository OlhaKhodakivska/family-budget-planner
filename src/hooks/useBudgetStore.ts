import { useEffect, useMemo, useReducer, useRef } from 'react';
import type { BudgetState, Language } from '../types/budget';
import { calculateTotals, initialBudgetState, toMoneyNumber } from '../utils/budget';
import { budgetReducer } from '../utils/budgetReducer';

const getStorageKey = (language: Language) => `family-budget-state-v2-${language}`;

const getInitialState = (language: Language): BudgetState => {
  try {
    const stored = window.localStorage.getItem(getStorageKey(language));
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

export const useBudgetStore = (language: Language) => {
  const hydratedLanguage = useRef(language);
  const skipNextPersist = useRef(false);
  const [state, dispatch] = useReducer(budgetReducer, language, getInitialState);

  useEffect(() => {
    hydratedLanguage.current = language;
    skipNextPersist.current = true;
    dispatch({ type: 'HYDRATE', payload: getInitialState(language) });
  }, [language]);

  useEffect(() => {
    if (hydratedLanguage.current !== language) return;
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }

    window.localStorage.setItem(getStorageKey(language), JSON.stringify(state));
  }, [language, state]);

  const totals = useMemo(() => calculateTotals(state), [state]);

  return { state, dispatch, totals };
};
