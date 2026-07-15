import { Pencil, Sparkles, Trash2 } from 'lucide-react';
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
  activeGoalId?: string | null;
  onEdit?: (goal: DreamGoal) => void;
}

export function DreamGoalsList({ goals, dispatch, separated = false, activeGoalId = null, onEdit }: DreamGoalsListProps) {
  const { t, formatCurrency, formatConvertedCurrency, formatDate } = useLocale();
  const orderedGoals = activeGoalId
    ? [...goals].sort((first, second) => Number(second.id === activeGoalId) - Number(first.id === activeGoalId))
    : goals;

  return (
    <section className={`${sectionStyles.section} ${separated ? styles.savedSection : ''}`} id="saved-dreams">
      <CardHeader
        title={t('savedGoals')}
        subtitle={t('dreamsSubtitle')}
        action={<Sparkles size={20} color="var(--color-secondary)" />}
      />
      <div className={sectionStyles.list}>
        {goals.length ? (
          orderedGoals.map((goal) => {
            const totalCost = goal.steps.reduce((sum, step) => sum + step.cost, 0);

            return (
              <article className={`${styles.goal} ${goal.id === activeGoalId ? styles.activeGoal : ''}`} key={goal.id}>
                <div className={styles.goalTop}>
                  <span className={styles.goalTitle}>
                    <Sparkles size={16} />
                    <strong>{goal.title}</strong>
                  </span>
                  <span className={styles.goalActions}>
                    {onEdit ? (
                      <IconButton icon={<Pencil size={18} />} label={`${t('edit')} ${goal.title}`} onClick={() => onEdit(goal)} />
                    ) : null}
                    <IconButton
                      icon={<Trash2 size={18} />}
                      label={`${t('removeGoal')} ${goal.title}`}
                      variant="danger"
                      onClick={() => dispatch({ type: 'REMOVE_DREAM_GOAL', payload: goal.id })}
                    />
                  </span>
                </div>
                {goal.note ? <p className={styles.note}>{goal.note}</p> : null}
                <span className={styles.stepsTitle}>{t('goalSteps')}</span>
                <ol className={styles.savedSteps}>
                  {goal.steps.map((step) => (
                    <li key={step.id}>
                      <span className={styles.savedStepContent}>
                        <span>{step.text}</span>
                        <strong>
                          <span>{formatCurrency(step.cost)}</span>
                          {formatConvertedCurrency(step.cost) ? <small>{formatConvertedCurrency(step.cost)}</small> : null}
                        </strong>
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
                    {formatConvertedCurrency(totalCost) ? ` (${formatConvertedCurrency(totalCost)})` : ''}
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
