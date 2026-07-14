import { Moon, Sun } from 'lucide-react';
import type { Theme } from '../../types/budget';
import { useLocale } from '../../hooks/useLocale';
import styles from './ThemeToggle.module.css';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const { t } = useLocale();

  return (
    <div className={styles.toggle} aria-label={t('themeSwitch')}>
      <button
        type="button"
        className={`${styles.option} ${theme === 'light' ? styles.active : ''}`}
        onClick={theme === 'dark' ? onToggle : undefined}
      >
        <Sun size={16} />
        {t('lightTheme')}
      </button>
      <button
        type="button"
        className={`${styles.option} ${theme === 'dark' ? styles.active : ''}`}
        onClick={theme === 'light' ? onToggle : undefined}
      >
        <Moon size={16} />
        {t('darkTheme')}
      </button>
    </div>
  );
}
