export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'denied';

  if (Notification.permission === 'granted') return 'granted';

  if (Notification.permission === 'denied') return 'denied';

  const permission = await Notification.requestPermission();
  return permission;
};

export const showAlarmNotification = (title: string, body: string): void => {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  if (Notification.permission !== 'granted') return;

  const notify = new Notification(title, {
    body,
    silent: false,
  });

  const onClick = (): void => {
    window.focus();
    notify.close();
  };

  notify.onclick = onClick;
};
