import { Task } from '@/types/task'
import { statusNew } from './mockStatus'
import { statusCompleted } from './mockStatus'
import { statusFrozen } from './mockStatus'
import { statusInProgress } from './mockStatus'
import { statusCancelled } from './mockStatus'

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Изучить Next.js',
    status: statusNew,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Создать компонент TaskList',
    status: statusCompleted,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '3',
    title: 'Добавить стили неоморфизма',
    status: statusCompleted,
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '4',
    title: 'Заморозить задачу',
    status: statusFrozen,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '5',
    title: 'Создать классные карточки задач',
    status: statusInProgress,
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '6',
    title: 'Реализовать старую фичу',
    status: statusCancelled,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    id: '7',
    title: 'Использовать устаревшую библиотеку',
    status: statusCancelled,
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-17'),
  },
]

