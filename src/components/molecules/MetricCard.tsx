import type { ReactNode } from 'react';
import { Skeleton } from '../atoms/Skeleton';
import styles from './MetricCard.module.css';

interface MetricCardProps {
  label: string;
  value: string;
  convertedValue?: string | null;
  icon: ReactNode;
  tone?: 'income' | 'expense' | 'primary' | 'secondary';
  loading?: boolean;
}

export function MetricCard({ label, value, convertedValue = null, icon, tone = 'primary', loading = false }: MetricCardProps) {
  return (
    <article className={`${styles.card} ${styles[tone]}`}>
      <div className={styles.label}>
        <span>{label}</span>
        {icon}
      </div>
      {loading ? (
        <Skeleton height={32} width="76%" />
      ) : (
        <p className={styles.value}>
          <span>{value}</span>
          {convertedValue ? <small>{convertedValue}</small> : null}
        </p>
      )}
    </article>
  );
}
