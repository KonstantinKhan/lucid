import { Relation } from '@/types/Relation'

export const mockRelationships: Relation[] = [
  {
    id: 'rel-1',
    sourceTaskId: '1',
    targetTaskId: '2',
    type: 'DEPENDS_ON',
    title: 'Зависит от',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'rel-2',
    sourceTaskId: '5',
    targetTaskId: '3',
    type: 'DEPENDS_ON',
    title: 'Зависит от',
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
  },
  {
    id: 'rel-3',
    sourceTaskId: '4',
    targetTaskId: '5',
    type: 'BLOCKS',
    title: 'Блокирует',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: 'rel-4',
    sourceTaskId: '2',
    targetTaskId: '3',
    type: 'RELATED',
    title: 'Связана с',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
  },
]