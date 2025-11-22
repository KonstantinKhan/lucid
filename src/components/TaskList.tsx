'use client';

import { Task } from '@/types/task';

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
            <div
              key={task.id}
              className={`neomorphic-card p-4 transition-all hover:scale-[1.02] ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={task.completed}
                  readOnly
                  className="mt-1 w-5 h-5 neomorphic-checkbox cursor-pointer"
                />
                <div className="flex-1">
                  <h3
                    className={`text-lg font-semibold mb-1 ${
                      task.completed ? 'line-through text-gray-400' : ''
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p
                      className={`text-sm text-gray-600 ${
                        task.completed ? 'line-through' : ''
                      }`}
                    >
                      {task.description}
                    </p>
                  )}
                  <div className="mt-2 text-xs text-gray-400">
                    Создано: {new Date(task.createdAt).toLocaleDateString('ru-RU')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

