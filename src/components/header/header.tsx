import { memo } from 'react';

import styles from './header.module.css';

export type HeaderProps = {
  href?: string;
  brand?: string;
};

export const Header = memo(({ href, brand }: HeaderProps) => {
  const finalHref = href || '/';
  const finalBrand = brand || 'Alarm';

  return (
    <header className={styles.header} role="banner">
      <nav className={styles.nav} aria-label="Главная навигация">
        <a className={styles.brand} href={finalHref} aria-label={`${finalBrand} — на главную`}>
          {finalBrand}
        </a>
      </nav>
    </header>
  );
});
