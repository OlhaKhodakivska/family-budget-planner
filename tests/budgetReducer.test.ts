import assert from 'node:assert/strict';
import test from 'node:test';
import type { BudgetEntry, BudgetState, DreamGoal } from '../src/types/budget';
import { initialBudgetState } from '../src/utils/budget';
import { budgetReducer } from '../src/utils/budgetReducer';

const stateWith = (next: Partial<BudgetState>): BudgetState => ({
  ...initialBudgetState,
  ...next,
});

test('updates and removes income entries', () => {
  const income: BudgetEntry = {
    id: 'income-1',
    category: 'Salary',
    label: 'July salary',
    amount: 1200,
    date: '2026-07-15',
  };

  const updated: BudgetEntry = {
    ...income,
    category: 'Bonus',
    label: 'July bonus',
    amount: 400,
  };

  const added = budgetReducer(stateWith({}), { type: 'ADD_INCOME', payload: income });
  const changed = budgetReducer(added, { type: 'UPDATE_INCOME', payload: updated });
  const removed = budgetReducer(changed, { type: 'REMOVE_INCOME', payload: income.id });

  assert.deepEqual(changed.incomes, [updated]);
  assert.deepEqual(removed.incomes, []);
});

test('updates and removes expense entries', () => {
  const expense: BudgetEntry = {
    id: 'expense-1',
    category: 'Groceries',
    label: 'Market',
    amount: 80,
    date: '2026-07-15',
  };

  const updated: BudgetEntry = {
    ...expense,
    category: 'School',
    amount: 95,
  };

  const added = budgetReducer(stateWith({}), { type: 'ADD_EXPENSE', payload: expense });
  const changed = budgetReducer(added, { type: 'UPDATE_EXPENSE', payload: updated });
  const removed = budgetReducer(changed, { type: 'REMOVE_EXPENSE', payload: expense.id });

  assert.deepEqual(changed.expenses, [updated]);
  assert.deepEqual(removed.expenses, []);
});

test('updates and removes dream goals', () => {
  const goal: DreamGoal = {
    id: 'dream-1',
    title: 'Course',
    note: 'Frontend',
    createdAt: '2026-07-15T08:00:00.000Z',
    steps: [{ id: 'goal-step-1', text: 'Enroll', cost: 300 }],
  };

  const updated: DreamGoal = {
    ...goal,
    title: 'Advanced course',
    steps: [{ id: 'goal-step-1', text: 'Enroll early', cost: 250 }],
  };

  const added = budgetReducer(stateWith({}), { type: 'ADD_DREAM_GOAL', payload: goal });
  const changed = budgetReducer(added, { type: 'UPDATE_DREAM_GOAL', payload: updated });
  const removed = budgetReducer(changed, { type: 'REMOVE_DREAM_GOAL', payload: goal.id });

  assert.deepEqual(changed.dreamGoals, [updated]);
  assert.deepEqual(removed.dreamGoals, []);
});
