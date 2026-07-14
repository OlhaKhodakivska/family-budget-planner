import { useState, type FormEvent } from 'react';
import { Plus } from 'lucide-react';
import type { BudgetAction, BudgetEntry } from '../../types/budget';
import { useLocale } from '../../hooks/useLocale';
import { capitalizeFirstLetter, createId, formatMoneyInput, incomeCategories } from '../../utils/budget';
import { Button } from '../atoms/Button';
import { Input, Select } from '../atoms/Input';
import { CardHeader } from '../molecules/CardHeader';
import { CategoryRow } from '../molecules/CategoryRow';
import { FormField } from '../molecules/FormField';
import styles from './Section.module.css';

interface IncomeSectionProps {
  incomes: BudgetEntry[];
  dispatch: React.Dispatch<BudgetAction>;
}

export function IncomeSection({ incomes, dispatch }: IncomeSectionProps) {
  const { language, t, parseInputAmount } = useLocale();
  const [category, setCategory] = useState<string>(incomeCategories[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedAmount = parseInputAmount(amount);
    if (!label.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) return;

    dispatch({
      type: 'ADD_INCOME',
      payload: {
        id: createId('income'),
        category: category === 'Other income' ? customCategory.trim() || category : category,
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
    <section className={styles.section} id="income">
      <CardHeader title={t('income')} subtitle={t('incomeSubtitle')} />
      <form className={styles.form} onSubmit={handleSubmit}>
        <FormField label={t('category')}>
          <Select value={category} onChange={(event) => setCategory(event.target.value)}>
            {incomeCategories.map((item) => (
              <option key={item} value={item}>
                {item === 'Salary' ? t('salary') : item === 'Gifts' ? t('gifts') : t('otherIncome')}
              </option>
            ))}
          </Select>
        </FormField>
        {category === 'Other income' ? (
          <FormField label={t('customCategory')}>
            <Input
              value={customCategory}
              onChange={(event) => setCustomCategory(capitalizeFirstLetter(event.target.value))}
              placeholder={t('freelanceBonus')}
            />
          </FormField>
        ) : null}
        <FormField label={t('label')}>
          <Input
            value={label}
            onChange={(event) => setLabel(capitalizeFirstLetter(event.target.value))}
            placeholder={t('monthlySalary')}
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
          <Button type="submit" icon={<Plus size={18} />} fullWidth>
            {t('addIncome')}
          </Button>
        </div>
      </form>
      <div className={styles.list}>
        {incomes.length ? (
          incomes.map((entry) => <CategoryRow key={entry.id} kind="income" {...entry} />)
        ) : (
          <p className={styles.empty}>{t('noIncome')}</p>
        )}
      </div>
    </section>
  );
}
