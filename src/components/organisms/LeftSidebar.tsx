import { CreditCard, Home, Landmark, ReceiptText, Sparkles, Wallet, X } from 'lucide-react';
import type { DashboardSection, DreamGoal, Theme } from '../../types/budget';
import { useLocale } from '../../hooks/useLocale';
import { IconButton } from '../atoms/IconButton';
import { ThemeToggle } from '../atoms/ThemeToggle';
import styles from './LeftSidebar.module.css';

interface LeftSidebarProps {
  theme: Theme;
  isOpen: boolean;
  activeSection: DashboardSection;
  activeGoalId: string | null;
  dreamGoals: DreamGoal[];
  netBalance: number;
  onClose: () => void;
  onSelectSection: (section: DashboardSection) => void;
  onSelectGoal: (goalId: string) => void;
  onToggleTheme: () => void;
}

const navItems = [
  { section: 'overview', labelKey: 'overview', icon: Home },
  { section: 'income', labelKey: 'income', icon: Wallet },
  { section: 'expenses', labelKey: 'expenses', icon: ReceiptText },
  { section: 'cards', labelKey: 'creditCards', icon: CreditCard },
  { section: 'savings', labelKey: 'savings', icon: Landmark },
] as const;

export function LeftSidebar({
  theme,
  isOpen,
  activeSection,
  activeGoalId,
  dreamGoals,
  netBalance,
  onClose,
  onSelectSection,
  onSelectGoal,
  onToggleTheme,
}: LeftSidebarProps) {
  const { language, setLanguage, t, formatCurrency, eurToUahRate, exchangeDate } = useLocale();

  const handleSelectSection = (section: DashboardSection) => {
    onSelectSection(section);
    onClose();
  };

  const handleSelectGoal = (goalId: string) => {
    onSelectGoal(goalId);
    onClose();
  };

  return (
    <>
      <div
        className={`${styles.scrim} ${isOpen ? '' : styles.scrimHidden}`}
        onClick={onClose}
        role="presentation"
      />
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`} aria-label={t('budgetNavigation')}>
        <div className={styles.brand}>
          <h1>{t('appTitle')}</h1>
          <p>{t('brandSubtitle')}</p>
          <span className={styles.mobileClose}>
            <IconButton icon={<X size={18} />} label={t('closeMenu')} onClick={onClose} />
          </span>
        </div>
        <nav className={styles.nav}>
          {navItems.map(({ section, labelKey, icon: Icon }) => (
            <span className={styles.navGroup} key={section}>
              <button
                type="button"
                className={activeSection === section ? styles.activeNavItem : ''}
                onClick={() => handleSelectSection(section)}
              >
                <Icon size={18} />
                {t(labelKey)}
              </button>
              {section === 'savings' && dreamGoals.length ? (
                <span className={styles.savedGoalsNav}>
                  {dreamGoals.map((goal) => (
                    <button
                      type="button"
                      key={goal.id}
                      className={activeGoalId === goal.id ? styles.activeGoalItem : ''}
                      onClick={() => handleSelectGoal(goal.id)}
                    >
                      <Sparkles size={14} />
                      {goal.title}
                    </button>
                  ))}
                </span>
              ) : null}
            </span>
          ))}
        </nav>
        <div className={styles.summary}>
          <div className={styles.balance}>
            <span>{t('netBalance')}</span>
            <strong>{formatCurrency(netBalance)}</strong>
          </div>
          <button
            type="button"
            className={`${styles.dreamButton} ${activeSection === 'dreams' ? styles.activeDreamButton : ''}`}
            onClick={() => handleSelectSection('dreams')}
          >
            <Sparkles size={18} />
            {t('dreamsGoals')}
          </button>
          <div className={styles.rate}>
            <span>{t('exchangeRate')}</span>
            <strong>
              {eurToUahRate && exchangeDate
                ? `1 € = ${eurToUahRate.toFixed(2)} ₴ · ${exchangeDate}`
                : t('rateUnavailable')}
            </strong>
          </div>
          <div className={styles.languageToggle} aria-label={t('language')}>
            <button
              type="button"
              className={language === 'en' ? styles.activeLanguage : ''}
              onClick={() => setLanguage('en')}
              aria-pressed={language === 'en'}
            >
              € EN
            </button>
            <button
              type="button"
              className={language === 'uk' ? styles.activeLanguage : ''}
              onClick={() => setLanguage('uk')}
              aria-pressed={language === 'uk'}
            >
              ₴ UA
            </button>
          </div>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </aside>
    </>
  );
}
