import { Sparkles, Trash2 } from 'lucide-react';
import type { BudgetAction, DreamGoal } from '../../types/budget';
import { useLocale } from '../../hooks/useLocale';
import { IconButton } from '../atoms/IconButton';
import { CardHeader } from '../molecules/CardHeader';
import styles from './DreamsAndGoals.module.css';
import sectionStyles from './Section.module.css';

interface DreamGoalsListProps {
  goals: DreamGoal[];
  dispatch: React.Dispatch<BudgetAction>;
  separated?: boolean;
}

export function DreamGoalsList({ goals, dispatch, separated = false }: DreamGoalsListProps) {
  const { t, formatCurrency, formatDate } = useLocale();

  return (
    <section className={`${sectionStyles.section} ${separated ? styles.savedSection : ''}`} id="saved-dreams">
      <CardHeader
        title={t('savedGoals')}
        subtitle={t('dreamsSubtitle')}
        action={<Sparkles size={20} color="var(--color-secondary)" />}
      />
      <div className={sectionStyles.list}>
        {goals.length ? (
          goals.map((goal) => {
            const totalCost = goal.steps.reduce((sum, step) => sum + step.cost, 0);

            return (
              <article className={styles.goal} key={goal.id}>
                <div className={styles.goalTop}>
                  <span className={styles.goalTitle}>
                    <Sparkles size={16} />
                    <strong>{goal.title}</strong>
                  </span>
                  <IconButton
                    icon={<Trash2 size={18} />}
                    label={`${t('removeGoal')} ${goal.title}`}
                    variant="danger"
                    onClick={() => dispatch({ type: 'REMOVE_DREAM_GOAL', payload: goal.id })}
                  />
                </div>
                {goal.note ? <p className={styles.note}>{goal.note}</p> : null}
                <span className={styles.stepsTitle}>{t('goalSteps')}</span>
                <ol className={styles.savedSteps}>
                  {goal.steps.map((step) => (
                    <li key={step.id}>
                      <span className={styles.savedStepContent}>
                        <span>{step.text}</span>
                        <strong>{formatCurrency(step.cost)}</strong>
                      </span>
                    </li>
                  ))}
                </ol>
                <div className={styles.goalFooter}>
                  <span>
                    {t('created')}: {formatDate(goal.createdAt)}
                  </span>
                  <strong>
                    {t('potentialCost')}: {formatCurrency(totalCost)}
                  </strong>
                </div>
              </article>
            );
          })
        ) : (
          <p className={sectionStyles.empty}>{t('noDreams')}</p>
        )}
      </div>
    </section>
  );
}
