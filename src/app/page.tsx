import TaskList from '@/components/TaskList';
import { Task } from '@/types/task';

// Пример данных для демонстрации
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Изучить Next.js',
    description: 'Изучить основы Next.js и App Router',
    completed: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Создать компонент TaskList',
    description: 'Реализовать компонент для отображения списка задач',
    completed: true,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '3',
    title: 'Добавить стили неоморфизма',
    description: 'Применить неоморфный дизайн к компонентам',
    completed: true,
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-16'),
  },
];

export default function Home() {
  return (
    <main className="min-h-screen py-8 px-4">
      <TaskList tasks={mockTasks} />
    </main>
  );
}
