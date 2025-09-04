import { memo } from 'react';

import styles from './hero-section.module.css';

export type HeroSectionProps = {
  title?: string;
  lead?: string;
};

export const HeroSection = memo(({ title, lead }: HeroSectionProps) => {
  const finalTitle = title || '⏰ Alarm Clock';
  const finalLead = lead || 'Эстетичный будильник на React + TS + Zustand. Поехали 🚀';

  return (
    <section className={styles.section} aria-labelledby="title">
      <h1 id="title" className={styles.title}>
        {finalTitle}
      </h1>
      <p className={styles.lead}>{finalLead}</p>
    </section>
  );
});
