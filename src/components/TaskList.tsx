'use client';

import { useState } from 'react';
import { Task } from '@/types/task';
import TaskCard from './TaskCard';
import { statusInProgress, statusCompleted } from '@/constants/mockStatus';

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks: initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleStatusChange = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id !== taskId) return task;

        // Логика смены статусов
        switch (task.status.id) {
          case '3': // Новая → В работе
            return { ...task, status: statusInProgress, updatedAt: new Date() };
          case '1': // В работе → Завершена
            return { ...task, status: statusCompleted, updatedAt: new Date() };
          case '4': // Заморожена → В работе
            return { ...task, status: statusInProgress, updatedAt: new Date() };
          case '2': // Завершена → без изменений
          case '5': // Отменено → без изменений
          default:
            return task;
        }
      })
    );
  };

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
            <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  );
}

