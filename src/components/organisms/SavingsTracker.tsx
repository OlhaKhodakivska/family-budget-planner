import { useState, type FormEvent } from 'react';
import { Landmark, Plus } from 'lucide-react';
import type { BudgetAction, SavingsTransfer } from '../../types/budget';
import { useLocale } from '../../hooks/useLocale';
import { capitalizeFirstLetter, createId, formatMoneyInput } from '../../utils/budget';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { CardHeader } from '../molecules/CardHeader';
import { FormField } from '../molecules/FormField';
import styles from './Section.module.css';

interface SavingsTrackerProps {
  balance: number;
  transfers: SavingsTransfer[];
  dispatch: React.Dispatch<BudgetAction>;
}

export function SavingsTracker({ balance, transfers, dispatch }: SavingsTrackerProps) {
  const { language, t, formatCurrency, formatConvertedCurrency, formatDate, parseInputAmount } = useLocale();
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedAmount = parseInputAmount(amount);
    if (!label.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) return;

    dispatch({
      type: 'ADD_SAVINGS_TRANSFER',
      payload: {
        id: createId('saving'),
        label: label.trim(),
        amount: parsedAmount,
        date,
      },
    });
    setLabel('');
    setAmount('');
  };

  return (
    <section className={styles.section} id="savings">
      <CardHeader
        title={t('savings')}
        subtitle={`${t('currentSavingsPool')}: ${formatCurrency(balance)}${
          formatConvertedCurrency(balance) ? ` (${formatConvertedCurrency(balance)})` : ''
        }`}
        action={<Landmark size={20} color="var(--color-income)" />}
      />
      <form className={styles.form} onSubmit={handleSubmit}>
        <FormField label={t('savingsGoal')}>
          <Input
            value={label}
            onChange={(event) => setLabel(capitalizeFirstLetter(event.target.value))}
            placeholder={t('emergencyFund')}
          />
        </FormField>
        <FormField label={t('transferAmount')}>
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
            {t('addTransfer')}
          </Button>
        </div>
      </form>
      <div className={styles.list}>
        {transfers.length ? (
          transfers.map((transfer) => (
            <article className={styles.transfer} key={transfer.id}>
              <span className={styles.transferText}>
                <strong>{transfer.label}</strong>
                <span>{formatDate(transfer.date)}</span>
              </span>
              <strong className={styles.transferAmount}>
                <span>{formatCurrency(transfer.amount)}</span>
                {formatConvertedCurrency(transfer.amount) ? <small>{formatConvertedCurrency(transfer.amount)}</small> : null}
              </strong>
            </article>
          ))
        ) : (
          <p className={styles.empty}>{t('noSavings')}</p>
        )}
      </div>
    </section>
  );
}
