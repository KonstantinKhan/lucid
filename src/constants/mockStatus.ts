import { Status } from '@/types/status';

export const statusInProgress: Status = {
  id: '1',
  title: 'В работе',
  icon: 'play-circle',
};

export const statusCompleted: Status = {
  id: '2',
  title: 'Выполнено',
  icon: 'check-circle',
};

export const statusNew: Status = {
  id: '3',
  title: 'Новая',
  icon: 'circle',
};

export const statusFrozen: Status = {
  id: '4',
  title: 'Заморожено',
  icon: 'pause-circle',
};

export const statusCancelled: Status = {
  id: '5',
  title: 'Отменено',
  icon: 'ban',
};