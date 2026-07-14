import styles from './Skeleton.module.css';

interface SkeletonProps {
  height?: number;
  width?: string;
}

export function Skeleton({ height = 24, width = '100%' }: SkeletonProps) {
  return <span className={styles.skeleton} style={{ height, width }} />;
}
