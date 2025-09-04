import { Fragment } from 'react';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { HeroSection } from '@/components/hero-section';
import { AlarmForm } from '@/components/alarm-form';
import { AlarmList } from '@/components/alarm-list';
import { AlarmRunner } from '@/components/alarm-runner';

import styles from './app.module.css';

export const App = () => {
  return (
    <Fragment>
      <Header />
      <main className={styles.main} role="main">
        <HeroSection />
        <AlarmForm />
        <AlarmList />
        <AlarmRunner />
      </main>
      <Footer />
    </Fragment>
  );
};
