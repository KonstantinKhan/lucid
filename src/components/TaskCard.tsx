'use client';

import { Task } from '@/types/Task';
import { PlayCircle, CheckCircle, Circle, PauseCircle, Ban, Lock, LucideIcon, Link2, AlertTriangle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  allTasks?: Task[];
  onStatusChange?: (taskId: string) => void;
}

const iconMap: Record<string, LucideIcon> = {
  'play-circle': PlayCircle,
  'check-circle': CheckCircle,
  'circle': Circle,
  'pause-circle': PauseCircle,
  'ban': Ban,
  'lock': Lock,
};

export default function TaskCard({ task, allTasks = [], onStatusChange }: TaskCardProps) {
  const isCompleted = task.status.id === '2';
  const isCancelled = task.status.id === '5';
  const isBlocked = task.status.id === '6';
  
  // Проверяем, заблокирована ли задача
  const isTaskBlocked = () => {
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

  const taskIsBlocked = isTaskBlocked();
  
  // Получаем связанные задачи
  const getRelatedTasks = () => {
    if (!task.relationships || task.relationships.length === 0) return [];
    
    return task.relationships.map(relation => {
      // Определяем, какая задача связана (source или target)
      const relatedTaskId = relation.sourceTaskId === task.id 
        ? relation.targetTaskId 
        : relation.sourceTaskId;
      
      const relatedTask = allTasks.find(t => t.id === relatedTaskId);
      
      if (!relatedTask) return null;
      
      return {
        relation,
        task: relatedTask,
        isSource: relation.sourceTaskId === task.id,
      };
    }).filter(Boolean) as Array<{
      relation: typeof task.relationships[0];
      task: Task;
      isSource: boolean;
    }>;
  };

  const relatedTasks = getRelatedTasks();
  const relationshipsCount = relatedTasks.length;
  
  // Определяем класс карточки в зависимости от статуса
  const getCardClassName = () => {
    const baseClass = 'p-4 transition-all hover:scale-[1.02] cursor-pointer';
    
    // Если задача заблокирована, показываем соответствующий стиль
    if (taskIsBlocked || isBlocked) {
      return `neomorphic-card-blocked ${baseClass}`;
    }
    
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
      case '6': // Заблокирована
        return `neomorphic-card-blocked ${baseClass}`;
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

  // Получаем текст типа связи на русском
  const getRelationTypeLabel = (type: string, isSource: boolean) => {
    switch (type) {
      case 'DEPENDS_ON':
        return isSource ? 'Зависит от' : 'Требуется для';
      case 'BLOCKS':
        return isSource ? 'Блокирует' : 'Заблокирована';
      case 'RELATED':
        return 'Связана с';
      default:
        return 'Связана с';
    }
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
            {(taskIsBlocked || isBlocked) && (
              <div className="flex items-center gap-1 ml-auto shrink-0" title="Задача заблокирована">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
              </div>
            )}
            {relationshipsCount > 0 && !taskIsBlocked && !isBlocked && (
              <div className="flex items-center gap-1 ml-auto shrink-0">
                <Link2 className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400">{relationshipsCount}</span>
              </div>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Создано: {new Date(task.createdAt).toLocaleDateString('ru-RU')}
          </div>
          
          {/* Список связанных задач */}
          {relatedTasks.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200/20">
              <div className="space-y-2">
                {relatedTasks.map(({ relation, task: relatedTask, isSource }) => (
                  <div 
                    key={relation.id} 
                    className="flex items-center gap-2 text-sm text-gray-500"
                  >
                    <span className="text-xs text-gray-400">
                      {getRelationTypeLabel(relation.type, isSource)}:
                    </span>
                    <span className={`${
                      relatedTask.status.id === '2' ? 'line-through text-green-600/70' : 
                      relatedTask.status.id === '5' ? 'line-through text-red-500/60' : 
                      'text-gray-600'
                    }`}>
                      {relatedTask.title}
                    </span>
                    {relatedTask.status.icon && iconMap[relatedTask.status.icon] && (
                      <span className="text-gray-400">
                        {(() => {
                          const IconComponent = iconMap[relatedTask.status.icon];
                          return <IconComponent className="w-3 h-3" />;
                        })()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

