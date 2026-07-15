import { Pencil, Trash2 } from 'lucide-react';
import type { EntryKind } from '../../types/budget';
import { useLocale } from '../../hooks/useLocale';
import { IconButton } from '../atoms/IconButton';
import { Badge } from '../atoms/Badge';
import styles from './CategoryRow.module.css';

interface CategoryRowProps {
  kind: EntryKind;
  category: string;
  label: string;
  amount: number;
  date: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function CategoryRow({ kind, category, label, amount, date, onEdit, onDelete }: CategoryRowProps) {
  const { t, formatCurrency, formatConvertedCurrency, formatDate } = useLocale();
  const convertedAmount = formatConvertedCurrency(amount);
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
      <div className={styles.side}>
        <strong className={`${styles.amount} ${styles[kind]}`}>
          <span>{formatCurrency(amount)}</span>
          {convertedAmount ? <small>{convertedAmount}</small> : null}
        </strong>
        {onEdit || onDelete ? (
          <span className={styles.actions}>
            {onEdit ? <IconButton icon={<Pencil size={16} />} label={`${t('edit')} ${label}`} onClick={onEdit} /> : null}
            {onDelete ? (
              <IconButton
                icon={<Trash2 size={16} />}
                label={`${t('delete')} ${label}`}
                variant="danger"
                onClick={onDelete}
              />
            ) : null}
          </span>
        ) : null}
      </div>
    </article>
  );
}
