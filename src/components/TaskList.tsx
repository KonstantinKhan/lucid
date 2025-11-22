'use client';

import { Task } from '@/types/task';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center neomorphic-text">
        Список задач
      </h1>
      
      {tasks.length === 0 ? (
        <div className="neomorphic-card p-8 text-center">
          <p className="text-gray-500">Нет задач. Добавьте первую задачу!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}

