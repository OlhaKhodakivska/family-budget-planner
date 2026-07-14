import { useLocale } from '../../hooks/useLocale';
import styles from './Spinner.module.css';

export function Spinner() {
  const { t } = useLocale();

  return <span className={styles.spinner} aria-label={t('loading')} />;
}
