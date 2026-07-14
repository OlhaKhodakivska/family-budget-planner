import { CreditCard } from 'lucide-react';
import type { CreditCard as CreditCardType } from '../../types/budget';
import { useLocale } from '../../hooks/useLocale';
import { IconButton } from '../atoms/IconButton';
import styles from './CreditCardItem.module.css';

interface CreditCardItemProps {
  card: CreditCardType;
  onRemove: (id: string) => void;
}

export function CreditCardItem({ card, onRemove }: CreditCardItemProps) {
  const { t, formatCurrency } = useLocale();
  const available = card.limit - card.debt;

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <h3 className={styles.name}>{card.name}</h3>
        <IconButton
          icon={<CreditCard size={18} />}
          label={`${t('removeCard')} ${card.name}`}
          variant="danger"
          onClick={() => onRemove(card.id)}
        />
      </div>
      <div className={styles.grid}>
        <span className={styles.metric}>
          <span>{t('limit')}</span>
          <strong>{formatCurrency(card.limit)}</strong>
        </span>
        <span className={styles.metric}>
          <span>{t('debt')}</span>
          <strong>{formatCurrency(card.debt)}</strong>
        </span>
        <span className={styles.metric}>
          <span>{t('available')}</span>
          <strong className={styles.available}>{formatCurrency(available)}</strong>
        </span>
      </div>
    </article>
  );
}
