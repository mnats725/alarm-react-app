import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { creator } from './creator';
import { alarmPartialize, migrateAlarmState, ALARM_PERSIST_NAME, ALARM_PERSIST_VERSION } from './persist-config';

import type { AlarmStore, AlarmPersistedState } from './alarm-store.type';

export const useAlarmStore = create<AlarmStore>()(
  persist<AlarmStore, [], [], AlarmPersistedState>(creator, {
    name: ALARM_PERSIST_NAME,
    storage: createJSONStorage<AlarmPersistedState>(() => localStorage),
    version: ALARM_PERSIST_VERSION,
    partialize: alarmPartialize,
    migrate: migrateAlarmState,
  })
);
