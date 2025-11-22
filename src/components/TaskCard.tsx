'use client';

import { Task } from '@/types/task';
import { PlayCircle, CheckCircle, Circle, PauseCircle, Ban, LucideIcon } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onStatusChange?: (taskId: string) => void;
}

const iconMap: Record<string, LucideIcon> = {
  'play-circle': PlayCircle,
  'check-circle': CheckCircle,
  'circle': Circle,
  'pause-circle': PauseCircle,
  'ban': Ban,
};

export default function TaskCard({ task, onStatusChange }: TaskCardProps) {
  const isCompleted = task.status.id === '2';
  const isCancelled = task.status.id === '5';
  
  // Определяем класс карточки в зависимости от статуса
  const getCardClassName = () => {
    const baseClass = 'p-4 transition-all hover:scale-[1.02] cursor-pointer';
    
    switch (task.status.id) {
      case '1': // В работе
        return `neomorphic-card-in-progress ${baseClass}`;
      case '2': // Выполнено
        return `neomorphic-card-completed ${baseClass} opacity-70`;
      case '3': // Новая
        return `neomorphic-card-new ${baseClass}`;
      case '4': // Заморожено
        return `neomorphic-card-frozen ${baseClass}`;
      case '5': // Отменено
        return `neomorphic-card-cancelled ${baseClass} opacity-50`;
      default:
        return `neomorphic-card ${baseClass}`;
    }
  };

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStatusChange) {
      onStatusChange(task.id);
    }
  };
  
  // Определяем стили заголовка в зависимости от статуса
  const getTitleClassName = () => {
    const baseClass = 'text-lg font-semibold';
    
    if (isCompleted) {
      return `${baseClass} line-through text-green-600/70`;
    } else if (isCancelled) {
      return `${baseClass} line-through text-red-500/60`;
    }
    
    return baseClass;
  };
  
  return (
    <div className={getCardClassName()}>
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {task.status.icon && iconMap[task.status.icon] && (
              <button
                onClick={handleIconClick}
                className="shrink-0 transition-transform hover:scale-110 focus:outline-none rounded"
                aria-label="Изменить статус задачи"
              >
                {(() => {
                  const IconComponent = iconMap[task.status.icon];
                  return <IconComponent className="w-5 h-5" />;
                })()}
              </button>
            )}
            <h3 className={getTitleClassName()}>
              {task.title}
            </h3>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Создано: {new Date(task.createdAt).toLocaleDateString('ru-RU')}
          </div>
        </div>
      </div>
    </div>
  );
}

