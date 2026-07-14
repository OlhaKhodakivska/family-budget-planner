import { useState, type FormEvent } from 'react';
import { Minus } from 'lucide-react';
import type { BudgetAction, BudgetEntry } from '../../types/budget';
import { useLocale } from '../../hooks/useLocale';
import { capitalizeFirstLetter, createId, expenseCategories, formatMoneyInput } from '../../utils/budget';
import { Button } from '../atoms/Button';
import { Input, Select } from '../atoms/Input';
import { CardHeader } from '../molecules/CardHeader';
import { CategoryRow } from '../molecules/CategoryRow';
import { FormField } from '../molecules/FormField';
import styles from './Section.module.css';

interface ExpenseSectionProps {
  expenses: BudgetEntry[];
  dispatch: React.Dispatch<BudgetAction>;
}

export function ExpenseSection({ expenses, dispatch }: ExpenseSectionProps) {
  const { language, t, parseInputAmount } = useLocale();
  const [category, setCategory] = useState<string>(expenseCategories[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedAmount = parseInputAmount(amount);
    if (!label.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) return;

    dispatch({
      type: 'ADD_EXPENSE',
      payload: {
        id: createId('expense'),
        category: customCategory.trim() || category,
        label: label.trim(),
        amount: parsedAmount,
        date,
      },
    });
    setLabel('');
    setAmount('');
    setCustomCategory('');
  };

  return (
    <section className={styles.section} id="expenses">
      <CardHeader title={t('expenses')} subtitle={t('expensesSubtitle')} />
      <form className={styles.form} onSubmit={handleSubmit}>
        <FormField label={t('category')}>
          <Select value={category} onChange={(event) => setCategory(event.target.value)}>
            {expenseCategories.map((item) => (
              <option key={item} value={item}>
                {item === 'Rent'
                  ? t('rent')
                  : item === 'Groceries'
                    ? t('groceries')
                    : item === 'Cosmetics'
                      ? t('cosmetics')
                      : item === 'Pets'
                        ? t('pets')
                        : t('hobby')}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label={t('customCategory')}>
          <Input
            value={customCategory}
            onChange={(event) => setCustomCategory(capitalizeFirstLetter(event.target.value))}
            placeholder={t('medicineSchool')}
          />
        </FormField>
        <FormField label={t('label')}>
          <Input
            value={label}
            onChange={(event) => setLabel(capitalizeFirstLetter(event.target.value))}
            placeholder={t('receiptNote')}
          />
        </FormField>
        <FormField label={t('amount')}>
          <Input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(formatMoneyInput(event.target.value))}
            placeholder={language === 'uk' ? '0 ₴' : '0 €'}
          />
        </FormField>
        <FormField label={t('date')}>
          <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </FormField>
        <div className={styles.full}>
          <Button type="submit" icon={<Minus size={18} />} variant="secondary" fullWidth>
            {t('addExpense')}
          </Button>
        </div>
      </form>
      <div className={styles.list}>
        {expenses.length ? (
          expenses.map((entry) => <CategoryRow key={entry.id} kind="expense" {...entry} />)
        ) : (
          <p className={styles.empty}>{t('noExpenses')}</p>
        )}
      </div>
    </section>
  );
}
