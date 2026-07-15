import { useMemo, useState, type FormEvent } from 'react';
import { Check, Plus, Sparkles, Star, Trash2, X } from 'lucide-react';
import type { BudgetAction, DreamGoal, DreamStep } from '../../types/budget';
import { useLocale } from '../../hooks/useLocale';
import { capitalizeFirstLetter, createId, formatMoneyInput } from '../../utils/budget';
import { Button } from '../atoms/Button';
import { IconButton } from '../atoms/IconButton';
import { Input, Textarea } from '../atoms/Input';
import { CardHeader } from '../molecules/CardHeader';
import { FormField } from '../molecules/FormField';
import { DreamGoalsList } from './DreamGoalsList';
import styles from './DreamsAndGoals.module.css';
import sectionStyles from './Section.module.css';

interface DraftStep {
  id: string;
  text: string;
  cost: string;
}

interface DreamsAndGoalsProps {
  goals: DreamGoal[];
  activeGoalId: string | null;
  dispatch: React.Dispatch<BudgetAction>;
}

const createDraftStep = (): DraftStep => ({
  id: createId('draft-step'),
  text: '',
  cost: '',
});

export function DreamsAndGoals({ goals, activeGoalId, dispatch }: DreamsAndGoalsProps) {
  const { language, t, formatCurrency, parseInputAmount } = useLocale();
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [steps, setSteps] = useState<DraftStep[]>([createDraftStep()]);
  const [editingGoal, setEditingGoal] = useState<DreamGoal | null>(null);

  const draftPotentialCost = useMemo(
    () =>
      steps.reduce((sum, step) => {
        const cost = parseInputAmount(step.cost);
        return Number.isFinite(cost) ? sum + cost : sum;
      }, 0),
    [parseInputAmount, steps],
  );

  const handleStepChange = (id: string, nextStep: Partial<DraftStep>) => {
    setSteps((current) => current.map((step) => (step.id === id ? { ...step, ...nextStep } : step)));
  };

  const resetForm = () => {
    setTitle('');
    setNote('');
    setSteps([createDraftStep()]);
    setEditingGoal(null);
  };

  const handleEdit = (goal: DreamGoal) => {
    setEditingGoal(goal);
    setTitle(goal.title);
    setNote(goal.note);
    setSteps(
      goal.steps.length
        ? goal.steps.map((step) => ({
            id: step.id,
            text: step.text,
            cost: formatCurrency(step.cost),
          }))
        : [createDraftStep()],
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedSteps: DreamStep[] = steps
      .map((step) => ({
        id: step.id.startsWith('goal-step') ? step.id : createId('goal-step'),
        text: step.text.trim(),
        cost: parseInputAmount(step.cost),
      }))
      .filter((step) => step.text || (Number.isFinite(step.cost) && step.cost > 0))
      .map((step) => ({
        ...step,
        cost: Number.isFinite(step.cost) ? step.cost : 0,
      }));

    if (!title.trim() || !parsedSteps.length) return;

    dispatch({
      type: editingGoal ? 'UPDATE_DREAM_GOAL' : 'ADD_DREAM_GOAL',
      payload: {
        id: editingGoal?.id ?? createId('dream'),
        title: title.trim(),
        note: note.trim(),
        steps: parsedSteps,
        createdAt: editingGoal?.createdAt ?? new Date().toISOString(),
      },
    });

    resetForm();
  };

  return (
    <section className={sectionStyles.section} id="dreams">
      <CardHeader
        title={t('dreamsGoals')}
        subtitle={t('dreamsSubtitle')}
        action={<Sparkles size={20} color="var(--color-secondary)" />}
      />
      <form className={sectionStyles.form} onSubmit={handleSubmit}>
        <FormField label={t('goalTitle')}>
          <Input
            value={title}
            onChange={(event) => setTitle(capitalizeFirstLetter(event.target.value))}
            placeholder={t('dreamPlaceholder')}
          />
        </FormField>
        <FormField label={t('potentialCost')}>
          <Input value={formatCurrency(draftPotentialCost)} readOnly />
        </FormField>
        <div className={sectionStyles.full}>
          <FormField label={t('planNote')}>
            <Textarea
              value={note}
              onChange={(event) => setNote(capitalizeFirstLetter(event.target.value))}
              placeholder={t('planPlaceholder')}
            />
          </FormField>
        </div>
        <div className={`${sectionStyles.full} ${styles.steps}`}>
          {steps.map((step, index) => (
            <div className={styles.step} key={step.id}>
              <FormField label={`${t('stepText')} ${index + 1}`}>
                <Input
                  value={step.text}
                  onChange={(event) => handleStepChange(step.id, { text: capitalizeFirstLetter(event.target.value) })}
                  placeholder={t('stepPlaceholder')}
                />
              </FormField>
              <FormField label={t('stepCost')}>
                <Input
                  type="text"
                  inputMode="decimal"
                  value={step.cost}
                  onChange={(event) => handleStepChange(step.id, { cost: formatMoneyInput(event.target.value) })}
                  placeholder={language === 'uk' ? '0 ₴' : '0 €'}
                />
              </FormField>
              <IconButton
                icon={<Trash2 size={18} />}
                label={`${t('removeGoal')} ${index + 1}`}
                variant="danger"
                onClick={() => setSteps((current) => current.filter((item) => item.id !== step.id))}
                disabled={steps.length === 1}
              />
            </div>
          ))}
        </div>
        <div className={`${sectionStyles.full} ${styles.actions}`}>
          <Button type="button" variant="secondary" icon={<Plus size={18} />} onClick={() => setSteps([...steps, createDraftStep()])}>
            {t('addStep')}
          </Button>
          <Button type="submit" icon={editingGoal ? <Check size={18} /> : <Star size={18} />}>
            {editingGoal ? t('updateGoal') : t('saveGoal')}
          </Button>
          {editingGoal ? (
            <Button type="button" variant="secondary" icon={<X size={18} />} onClick={resetForm}>
              {t('cancel')}
            </Button>
          ) : null}
        </div>
      </form>
      <DreamGoalsList goals={goals} activeGoalId={activeGoalId} dispatch={dispatch} onEdit={handleEdit} />
    </section>
  );
}
