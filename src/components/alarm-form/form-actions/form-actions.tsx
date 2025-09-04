import { memo } from 'react';

import styles from './form-actions.module.css';

export type FormActionsProps = {
  isCompact?: boolean;
  children: React.ReactNode;
};

export const FormActions = memo(({ isCompact, children }: FormActionsProps) => {
  return <div className={isCompact ? styles.containerCompact : styles.container}>{children}</div>;
});
