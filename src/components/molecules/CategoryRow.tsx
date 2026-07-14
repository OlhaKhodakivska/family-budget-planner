import type { EntryKind } from '../../types/budget';
import { useLocale } from '../../hooks/useLocale';
import { Badge } from '../atoms/Badge';
import styles from './CategoryRow.module.css';

interface CategoryRowProps {
  kind: EntryKind;
  category: string;
  label: string;
  amount: number;
  date: string;
}

export function CategoryRow({ kind, category, label, amount, date }: CategoryRowProps) {
  const { t, formatCurrency, formatDate } = useLocale();
  const translatedCategory =
    category === 'Salary'
      ? t('salary')
      : category === 'Gifts'
        ? t('gifts')
        : category === 'Other income'
          ? t('otherIncome')
          : category === 'Rent'
            ? t('rent')
            : category === 'Groceries'
              ? t('groceries')
              : category === 'Cosmetics'
                ? t('cosmetics')
                : category === 'Pets'
                  ? t('pets')
                  : category === 'Hobby'
                    ? t('hobby')
                    : category;

  return (
    <article className={styles.row}>
      <div className={styles.content}>
        <Badge tone={kind}>{translatedCategory}</Badge>
        <span className={styles.label}>{label}</span>
        <span className={styles.meta}>{formatDate(date)}</span>
      </div>
      <strong className={`${styles.amount} ${styles[kind]}`}>{formatCurrency(amount)}</strong>
    </article>
  );
}
