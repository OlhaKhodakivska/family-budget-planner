import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { useLocale } from '../../hooks/useLocale';
import { IconButton } from '../atoms/IconButton';
import styles from './DynamicModal.module.css';

interface DynamicModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function DynamicModal({ title, children, onClose }: DynamicModalProps) {
  const { t } = useLocale();

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={onClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={styles.top}>
          <h2 className={styles.title}>{title}</h2>
          <IconButton icon={<X size={18} />} label={t('closeModal')} onClick={onClose} />
        </div>
        {children}
      </section>
    </div>
  );
}
