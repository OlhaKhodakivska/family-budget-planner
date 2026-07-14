import type { ReactNode } from 'react';
import { Menu } from 'lucide-react';
import type { DashboardSection, DreamGoal, Theme } from '../../types/budget';
import { useLocale } from '../../hooks/useLocale';
import { IconButton } from '../atoms/IconButton';
import { LeftSidebar } from '../organisms/LeftSidebar';
import styles from './DashboardLayout.module.css';

interface DashboardLayoutProps {
  children: ReactNode;
  theme: Theme;
  sidebarOpen: boolean;
  activeSection: DashboardSection;
  dreamGoals: DreamGoal[];
  netBalance: number;
  onOpenSidebar: () => void;
  onCloseSidebar: () => void;
  onSelectSection: (section: DashboardSection) => void;
  onToggleTheme: () => void;
}

export function DashboardLayout({
  children,
  theme,
  sidebarOpen,
  activeSection,
  dreamGoals,
  netBalance,
  onOpenSidebar,
  onCloseSidebar,
  onSelectSection,
  onToggleTheme,
}: DashboardLayoutProps) {
  const { t } = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <div className={styles.layout}>
      <LeftSidebar
        theme={theme}
        isOpen={sidebarOpen}
        activeSection={activeSection}
        dreamGoals={dreamGoals}
        netBalance={netBalance}
        onClose={onCloseSidebar}
        onSelectSection={onSelectSection}
        onToggleTheme={onToggleTheme}
      />
      <main className={styles.main}>
        <header className={styles.topbar}>
          <IconButton icon={<Menu size={18} />} label={t('openMenu')} onClick={onOpenSidebar} />
          <strong>{t('appTitle')}</strong>
        </header>
        <div className={styles.content}>{children}</div>
        <footer className={styles.footer}>
          <span>
            © 2026-{currentYear} {t('footer')}
          </span>
          <span className={styles.contact}>
            {t('footerContact')}{' '}
            <a href="mailto:olhakhodakivska@gmail.com">olhakhodakivska@gmail.com</a>
          </span>
        </footer>
      </main>
    </div>
  );
}
