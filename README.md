# ⏰ Alarm Clock (React + TS)

Минималистичный будильник с повторами по дням, выбором звука, Snooze (5 мин) и отключением. Состояние сохраняется между сессиями.

## Технологии

React 18 · TypeScript · Zustand (+persist) · CSS Modules (nesting) · Web Audio API / `<audio>` · Web Notifications · nanoid

## Архитектура

```
src/
  components/
    alarm-form/    (time, label, sound, volume, weekday, actions)
    alarm-list/    (list + alarm-card)
    alarm-runner/  (tick + toast UI)
  store/
    alarm-store/   (creator, types, persist-config, index)
  utils/           (alarm, notification, sound, time)
  constants/       (week-days, sounds)
  types/           (alarm)
```

## Модель

```ts
export type Alarm = {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  repeat: (0 | 1 | 2 | 3 | 4 | 5 | 6)[];
  volume: number;
  soundId: 'beep' | 'chime' | 'digital' | 'birds' | 'classic';
  snoozeUntilKey: string | null; // YYYY-MM-DDTHH:mm
};
```

## Store

`addAlarm`, `updateAlarm`, `toggleAlarm`, `removeAlarm`, `clearAll`, `snoozeAlarm(+5m)`, `disableAlarm`.
Persist v2: храним `{ alarms }`, миграция без `any`.

## Поведение

`AlarmRunner` раз в секунду сверяет «минутный ключ» и при совпадении показывает тост, играет звук, шлёт уведомление.

## Звуки

Файлы в `/public/sounds/*` + пресеты в `constants/sounds.const.ts`. Если файла нет — WebAudio «beep».

## Запуск

```bash
yarn
yarn dev
```
