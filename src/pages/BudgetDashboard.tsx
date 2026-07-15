import { useEffect, useState } from 'react';
import { Banknote, ChartNoAxesColumnIncreasing, CreditCard, Landmark, ReceiptText } from 'lucide-react';
import type { DashboardSection } from '../types/budget';
import { Spinner } from '../components/atoms/Spinner';
import { MetricCard } from '../components/molecules/MetricCard';
import { CreditCardManager } from '../components/organisms/CreditCardManager';
import { DreamsAndGoals } from '../components/organisms/DreamsAndGoals';
import { DreamGoalsList } from '../components/organisms/DreamGoalsList';
import { ExpenseSection } from '../components/organisms/ExpenseSection';
import { IncomeSection } from '../components/organisms/IncomeSection';
import { SavingsTracker } from '../components/organisms/SavingsTracker';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { useBudgetStore } from '../hooks/useBudgetStore';
import { useLocale } from '../hooks/useLocale';
import { useTheme } from '../hooks/useTheme';
import { getHashForSection, getRouteFromHash } from '../utils/routes';
import styles from './BudgetDashboard.module.css';

export function BudgetDashboard() {
  const { theme, toggleTheme } = useTheme();
  const { language, t, formatCurrency, formatConvertedCurrency } = useLocale();
  const { state, dispatch, totals } = useBudgetStore(language);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<DashboardSection>(() => getRouteFromHash(window.location.hash).section);
  const [activeGoalId, setActiveGoalId] = useState<string | null>(() => getRouteFromHash(window.location.hash).goalId);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  const selectSection = (section: DashboardSection) => {
    setActiveSection(section);
    setActiveGoalId(null);
    window.history.pushState(null, '', getHashForSection(section));
  };

  const selectGoal = (goalId: string) => {
    setActiveSection('dreams');
    setActiveGoalId(goalId);
    window.history.pushState(null, '', getHashForSection('dreams', goalId));
  };

  useEffect(() => {
    const handleHashChange = () => {
      const route = getRouteFromHash(window.location.hash);
      setActiveSection(route.section);
      setActiveGoalId(route.goalId);
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return;
    setCalculating(true);
    const timer = window.setTimeout(() => setCalculating(false), 320);
    return () => window.clearTimeout(timer);
  }, [state, loading]);

  return (
    <DashboardLayout
      theme={theme}
      sidebarOpen={sidebarOpen}
      activeSection={activeSection}
      activeGoalId={activeGoalId}
      dreamGoals={state.dreamGoals}
      netBalance={totals.netBalance}
      onOpenSidebar={() => setSidebarOpen(true)}
      onCloseSidebar={() => setSidebarOpen(false)}
      onSelectSection={selectSection}
      onSelectGoal={selectGoal}
      onToggleTheme={toggleTheme}
    >
      {activeSection === 'overview' ? (
        <>
          <section className={styles.hero} id="overview">
            <div className={styles.intro}>
              <h2>{t('heroTitle')}</h2>
              <p>{t('heroSubtitle')}</p>
            </div>
            <aside className={styles.pulse}>
              <div className={styles.pulseTop}>
                <span>{t('financialPulse')}</span>
                {calculating ? (
                  <span className={styles.loading}>
                    <Spinner />
                    {t('updating')}
                  </span>
                ) : (
                  <ChartNoAxesColumnIncreasing size={22} color="var(--color-income)" />
                )}
              </div>
              <strong>{formatCurrency(totals.netBalance)}</strong>
            </aside>
          </section>

          <section className={styles.metrics} aria-label={t('financialTotals')}>
            <MetricCard
              label={t('totalIncome')}
              value={formatCurrency(totals.totalIncome)}
              convertedValue={formatConvertedCurrency(totals.totalIncome)}
              icon={<Banknote size={22} />}
              tone="income"
              loading={loading}
            />
            <MetricCard
              label={t('totalExpenses')}
              value={formatCurrency(totals.totalExpenses)}
              convertedValue={formatConvertedCurrency(totals.totalExpenses)}
              icon={<ReceiptText size={22} />}
              tone="expense"
              loading={loading}
            />
            <MetricCard
              label={t('totalSavings')}
              value={formatCurrency(totals.totalSavings)}
              convertedValue={formatConvertedCurrency(totals.totalSavings)}
              icon={<Landmark size={22} />}
              tone="primary"
              loading={loading}
            />
            <MetricCard
              label={t('creditAvailable')}
              value={formatCurrency(totals.totalCreditAvailable)}
              convertedValue={formatConvertedCurrency(totals.totalCreditAvailable)}
              icon={<CreditCard size={22} />}
              tone="secondary"
              loading={loading}
            />
          </section>
        </>
      ) : null}

      {activeSection === 'overview' ? (
        <section className={styles.workspaceOverview}>
          <div className={styles.stack}>
            <IncomeSection incomes={state.incomes} dispatch={dispatch} />
            <ExpenseSection expenses={state.expenses} dispatch={dispatch} />
          </div>
          <div className={styles.stack}>
            <CreditCardManager
              cards={state.creditCards}
              totalLimit={totals.totalCreditLimit}
              totalDebt={totals.totalCreditDebt}
              dispatch={dispatch}
            />
            <SavingsTracker
              balance={state.savingsBalance}
              transfers={state.savingsTransfers}
              dispatch={dispatch}
            />
            <DreamGoalsList goals={state.dreamGoals} dispatch={dispatch} separated />
          </div>
        </section>
      ) : (
        <section className={styles.workspace}>
          {activeSection === 'income' ? <IncomeSection incomes={state.incomes} dispatch={dispatch} /> : null}
          {activeSection === 'expenses' ? <ExpenseSection expenses={state.expenses} dispatch={dispatch} /> : null}
          {activeSection === 'cards' ? (
            <CreditCardManager
              cards={state.creditCards}
              totalLimit={totals.totalCreditLimit}
              totalDebt={totals.totalCreditDebt}
              dispatch={dispatch}
            />
          ) : null}
          {activeSection === 'savings' ? (
            <SavingsTracker
              balance={state.savingsBalance}
              transfers={state.savingsTransfers}
              dispatch={dispatch}
            />
          ) : null}
          {activeSection === 'dreams' ? (
            <DreamsAndGoals goals={state.dreamGoals} activeGoalId={activeGoalId} dispatch={dispatch} />
          ) : null}
        </section>
      )}
    </DashboardLayout>
  );
}
