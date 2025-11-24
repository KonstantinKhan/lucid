'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/types/Task';
import TaskCard from './TaskCard';
import StatusFilterDropdown from './StatusFilterDropdown';
import SortDropdown, { SortType, SortDirection } from './SortDropdown';
import { 
  statusInProgress, 
  statusCompleted, 
  statusNew, 
  statusFrozen, 
  statusCancelled,
  statusBlocked
} from '@/constants/mockStatus';

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks: initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [sortType, setSortType] = useState<SortType>('none');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Проверяем, заблокирована ли задача
  const checkTaskBlocked = (task: Task, allTasks: Task[]): boolean => {
    if (!task.relationships || task.relationships.length === 0) return false;
    
    for (const relation of task.relationships) {
      const relatedTaskId = relation.sourceTaskId === task.id 
        ? relation.targetTaskId 
        : relation.sourceTaskId;
      
      const relatedTask = allTasks.find(t => t.id === relatedTaskId);
      
      if (!relatedTask) continue;
      
      // Задача заблокирована, если:
      // 1. Есть незавершённая зависимость (DEPENDS_ON, где текущая задача - source)
      if (relation.type === 'DEPENDS_ON' && relation.sourceTaskId === task.id) {
        if (relatedTask.status.id !== '2') { // Зависимая задача не завершена
          return true;
        }
      }
      
      // 2. Есть незавершённая блокирующая задача (BLOCKS, где текущая задача - target)
      if (relation.type === 'BLOCKS' && relation.targetTaskId === task.id) {
        if (relatedTask.status.id !== '2') { // Блокирующая задача не завершена
          return true;
        }
      }
    }
    
    return false;
  };

  // Проверяем и обновляем статусы всех задач на основе блокировок
  const updateBlockedStatuses = (currentTasks: Task[]): Task[] => {
    return currentTasks.map(task => {
      const isBlocked = checkTaskBlocked(task, currentTasks);
      
      // Если задача заблокирована и находится в статусе "В работе", меняем на "Заблокирована"
      if (isBlocked && task.status.id === '1') {
        return { ...task, status: statusBlocked, updatedAt: new Date() };
      }
      
      // Если задача разблокирована и находится в статусе "Заблокирована", меняем на "Новая"
      if (!isBlocked && task.status.id === '6') {
        return { ...task, status: statusNew, updatedAt: new Date() };
      }
      
      return task;
    });
  };

  // Автоматически проверяем блокировки при загрузке
  useEffect(() => {
    setTasks(prevTasks => updateBlockedStatuses(prevTasks));
  }, []);

  const handleStatusChange = (taskId: string) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) => {
        if (task.id !== taskId) return task;

        // Проверяем, не заблокирована ли задача перед изменением статуса
        const isBlocked = checkTaskBlocked(task, prevTasks);
        
        // Если задача заблокирована и пытаемся перевести в "В работе", блокируем изменение
        if (isBlocked && task.status.id !== '1' && task.status.id !== '6') {
          // Не позволяем перевести заблокированную задачу в "В работе"
          return task;
        }

        // Логика смены статусов
        switch (task.status.id) {
          case '3': // Новая → В работе
            // Проверяем блокировку перед переходом
            if (isBlocked) {
              return { ...task, status: statusBlocked, updatedAt: new Date() };
            }
            return { ...task, status: statusInProgress, updatedAt: new Date() };
          case '1': // В работе → Завершена
            return { ...task, status: statusCompleted, updatedAt: new Date() };
          case '4': // Заморожена → В работе
            // Проверяем блокировку перед переходом
            if (isBlocked) {
              return { ...task, status: statusBlocked, updatedAt: new Date() };
            }
            return { ...task, status: statusInProgress, updatedAt: new Date() };
          case '6': // Заблокирована → Новая (если разблокирована)
            if (!isBlocked) {
              return { ...task, status: statusNew, updatedAt: new Date() };
            }
            return task;
          case '2': // Завершена → без изменений
          case '5': // Отменено → без изменений
          default:
            return task;
        }
      });
      
      // После изменения статуса проверяем и обновляем блокировки всех задач
      return updateBlockedStatuses(updatedTasks);
    });
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

    // Приоритет статусов: В работе (1), Новые (3), Заблокированы (6), Заморожены (4), Завершены (2), Отменены (5)
    const statusPriority: Record<string, number> = {
      '1': 0, // В работе
      '3': 1, // Новые
      '6': 2, // Заблокированы
      '4': 3, // Заморожены
      '2': 4, // Завершены
      '5': 5, // Отменены
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
    { id: '6', title: 'Заблокированы', status: statusBlocked },
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
                <TaskCard 
                  task={task} 
                  allTasks={tasks}
                  onStatusChange={handleStatusChange} 
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

