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
  const { t, formatCurrency, formatConvertedCurrency } = useLocale();
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
          <strong>
            <span>{formatCurrency(card.limit)}</span>
            {formatConvertedCurrency(card.limit) ? <small>{formatConvertedCurrency(card.limit)}</small> : null}
          </strong>
        </span>
        <span className={styles.metric}>
          <span>{t('debt')}</span>
          <strong>
            <span>{formatCurrency(card.debt)}</span>
            {formatConvertedCurrency(card.debt) ? <small>{formatConvertedCurrency(card.debt)}</small> : null}
          </strong>
        </span>
        <span className={styles.metric}>
          <span>{t('available')}</span>
          <strong className={styles.available}>
            <span>{formatCurrency(available)}</span>
            {formatConvertedCurrency(available) ? <small>{formatConvertedCurrency(available)}</small> : null}
          </strong>
        </span>
      </div>
    </article>
  );
}
