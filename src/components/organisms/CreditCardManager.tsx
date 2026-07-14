import { useState, type FormEvent } from 'react';
import { CreditCard, Plus } from 'lucide-react';
import type { BudgetAction, CreditCard as CreditCardType } from '../../types/budget';
import { useLocale } from '../../hooks/useLocale';
import { capitalizeFirstLetter, createId, formatMoneyInput } from '../../utils/budget';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { CardHeader } from '../molecules/CardHeader';
import { CreditCardItem } from '../molecules/CreditCardItem';
import { FormField } from '../molecules/FormField';
import styles from './Section.module.css';

interface CreditCardManagerProps {
  cards: CreditCardType[];
  totalLimit: number;
  totalDebt: number;
  dispatch: React.Dispatch<BudgetAction>;
}

export function CreditCardManager({ cards, totalLimit, totalDebt, dispatch }: CreditCardManagerProps) {
  const { language, t, formatCurrency, parseInputAmount } = useLocale();
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');
  const [debt, setDebt] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedLimit = parseInputAmount(limit);
    const parsedDebt = parseInputAmount(debt);
    if (
      !name.trim() ||
      !Number.isFinite(parsedLimit) ||
      !Number.isFinite(parsedDebt) ||
      parsedLimit <= 0 ||
      parsedDebt < 0 ||
      parsedDebt > parsedLimit
    ) {
      return;
    }

    dispatch({
      type: 'ADD_CARD',
      payload: {
        id: createId('card'),
        name: name.trim(),
        limit: parsedLimit,
        debt: parsedDebt,
      },
    });
    setName('');
    setLimit('');
    setDebt('');
  };

  return (
    <section className={styles.section} id="cards">
      <CardHeader
        title={t('creditCards')}
        subtitle={`${formatCurrency(totalDebt)} ${t('usedFrom')} ${formatCurrency(totalLimit)}`}
        action={<CreditCard size={20} color="var(--color-secondary)" />}
      />
      <form className={styles.form} onSubmit={handleSubmit}>
        <FormField label={t('cardName')}>
          <Input
            value={name}
            onChange={(event) => setName(capitalizeFirstLetter(event.target.value))}
            placeholder={t('cardPlaceholder')}
          />
        </FormField>
        <FormField label={t('creditLimit')}>
          <Input
            type="text"
            inputMode="decimal"
            value={limit}
            onChange={(event) => setLimit(formatMoneyInput(event.target.value))}
            placeholder={language === 'uk' ? '0 ₴' : '0 €'}
          />
        </FormField>
        <FormField label={t('currentDebt')}>
          <Input
            type="text"
            inputMode="decimal"
            value={debt}
            onChange={(event) => setDebt(formatMoneyInput(event.target.value))}
            placeholder={language === 'uk' ? '0 ₴' : '0 €'}
          />
        </FormField>
        <div className={styles.full}>
          <Button type="submit" icon={<Plus size={18} />} variant="secondary" fullWidth>
            {t('addCard')}
          </Button>
        </div>
      </form>
      <div className={styles.list}>
        {cards.length ? (
          cards.map((card) => (
            <CreditCardItem
              key={card.id}
              card={card}
              onRemove={(id) => dispatch({ type: 'REMOVE_CARD', payload: id })}
            />
          ))
        ) : (
          <p className={styles.empty}>{t('noCards')}</p>
        )}
      </div>
    </section>
  );
}
