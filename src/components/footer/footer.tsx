import { memo } from 'react';

import styles from './footer.module.css';

export type FooterProps = {
  year?: number;
};

export const Footer = memo(({ year }: FooterProps) => {
  const finalYear = year ?? new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <small>© {finalYear} Alarm</small>
    </footer>
  );
});
