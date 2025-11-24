'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/types/task';
import TaskCard from './TaskCard';
import StatusFilterDropdown from './StatusFilterDropdown';
import SortDropdown, { SortType, SortDirection } from './SortDropdown';
import { 
  statusInProgress, 
  statusCompleted, 
  statusNew, 
  statusFrozen, 
  statusCancelled 
} from '@/constants/mockStatus';

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks: initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [sortType, setSortType] = useState<SortType>('none');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

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

  const handleStatusFilterChange = (statusId: string) => {
    setSelectedStatuses((prev) => {
      if (prev.includes(statusId)) {
        return prev.filter((id) => id !== statusId);
      } else {
        return [...prev, statusId];
      }
    });
  };

  const handleStatusFilterClear = () => {
    setSelectedStatuses([]);
  };

  const handleSortChange = (type: SortType) => {
    if (sortType === type) {
      // Если уже выбран этот тип, меняем направление
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      // Новый тип сортировки
      setSortType(type);
      setSortDirection('desc');
    }
  };

  const getFilteredAndSortedTasks = (): Task[] => {
    let filtered = tasks;

    // Фильтрация по статусам
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((task) =>
        selectedStatuses.includes(task.status.id)
      );
    }

    // Приоритет статусов: В работе (1), Новые (3), Заморожены (4), Завершены (2), Отменены (5)
    const statusPriority: Record<string, number> = {
      '1': 0, // В работе
      '3': 1, // Новые
      '4': 2, // Заморожены
      '2': 3, // Завершены
      '5': 4, // Отменены
    };

    // Сортировка
    filtered = [...filtered].sort((a, b) => {
      if (sortType === 'none') {
        // Сортировка по приоритету статусов
        return statusPriority[a.status.id] - statusPriority[b.status.id];
      } else {
        // Сортировка по датам
        const dateA = sortType === 'createdAt' ? a.createdAt : a.updatedAt;
        const dateB = sortType === 'createdAt' ? b.createdAt : b.updatedAt;
        
        const comparison = dateA.getTime() - dateB.getTime();
        return sortDirection === 'asc' ? comparison : -comparison;
      }
    });

    return filtered;
  };

  const filteredTasks = getFilteredAndSortedTasks();

  const allStatuses = [
    { id: '1', title: 'В работе', status: statusInProgress },
    { id: '3', title: 'Новые', status: statusNew },
    { id: '4', title: 'Заморожены', status: statusFrozen },
    { id: '2', title: 'Завершены', status: statusCompleted },
    { id: '5', title: 'Отменены', status: statusCancelled },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Заголовок и фильтры */}
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-3xl font-bold neomorphic-text">
          Список задач
        </h1>
        
        {/* Компактные выпадающие фильтры */}
        <div className="flex gap-3">
          <StatusFilterDropdown
            selectedStatuses={selectedStatuses}
            onChange={handleStatusFilterChange}
            onClear={handleStatusFilterClear}
            allStatuses={allStatuses.map(({ id, title }) => ({ id, title }))}
          />
          <SortDropdown
            sortType={sortType}
            sortDirection={sortDirection}
            onChange={handleSortChange}
          />
        </div>
      </div>

      {/* Список задач */}
      {filteredTasks.length === 0 ? (
        <div className="neomorphic-card p-8 text-center">
          <p className="text-gray-500">
            {tasks.length === 0
              ? 'Нет задач. Добавьте первую задачу!'
              : 'Нет задач, соответствующих выбранным фильтрам.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  layout: { duration: 0.3, ease: 'easeInOut' },
                  opacity: { duration: 0.2 },
                  y: { duration: 0.2 }
                }}
              >
                <TaskCard task={task} onStatusChange={handleStatusChange} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

