import { Task } from '@/types/Task'
import { statusNew } from './mockStatus'
import { statusCompleted } from './mockStatus'
import { statusFrozen } from './mockStatus'
import { statusInProgress } from './mockStatus'
import { statusCancelled } from './mockStatus'
import { mockRelationships } from './mockRelationships'

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Изучить Next.js',
    status: statusNew,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    relationships: [mockRelationships[0]], // source: зависит от задачи 2
  },
  {
    id: '2',
    title: 'Создать компонент TaskList',
    status: statusCompleted,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-16'),
    relationships: [
      mockRelationships[0], // target: задача 1 зависит от этой
      mockRelationships[3], // source: связана с задачей 3
    ],
  },
  {
    id: '3',
    title: 'Добавить стили неоморфизма',
    status: statusCompleted,
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-16'),
    relationships: [
      mockRelationships[1], // target: задача 5 зависит от этой
      mockRelationships[3], // target: связана с задачей 2
    ],
  },
  {
    id: '4',
    title: 'Заморозить задачу',
    status: statusFrozen,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-16'),
    relationships: [mockRelationships[2]], // source: блокирует задачу 5
  },
  {
    id: '5',
    title: 'Создать классные карточки задач',
    status: statusInProgress,
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-16'),
    relationships: [
      mockRelationships[1], // source: зависит от задачи 3
      mockRelationships[2], // target: заблокирована задачей 4
    ],
  },
  {
    id: '6',
    title: 'Реализовать старую фичу',
    status: statusCancelled,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-17'),
    relationships: [],
  },
  {
    id: '7',
    title: 'Использовать устаревшую библиотеку',
    status: statusCancelled,
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-17'),
    relationships: [],
  },
  {
    id: '8',
    title: 'Настроить систему связей между задачами',
    status: statusInProgress,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    relationships: [],
  },
  {
    id: '9',
    title: 'Добавить отображение зависимостей в UI',
    status: statusNew,
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19'),
    relationships: [],
  },
]

