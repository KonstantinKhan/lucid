'use client';

import { useState, useRef, useEffect } from 'react';

export type SortType = 'none' | 'createdAt' | 'updatedAt';
export type SortDirection = 'asc' | 'desc';

interface SortDropdownProps {
  sortType: SortType;
  sortDirection: SortDirection;
  onChange: (type: SortType) => void;
}

export default function SortDropdown({
  sortType,
  sortDirection,
  onChange,
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSortChange = (type: SortType) => {
    onChange(type);
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (sortType === 'none') return 'По умолчанию';
    if (sortType === 'createdAt') return 'Дата создания';
    return 'Дата обновления';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="neomorphic-card px-4 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all flex items-center gap-2"
      >
        <span>
          {getDisplayText()}
          {sortType !== 'none' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 neomorphic-card rounded-lg shadow-lg z-10 p-2">
          <div className="space-y-1">
            <button
              onClick={() => handleSortChange('none')}
              className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${
                sortType === 'none' ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-medium' : ''
              }`}
            >
              По умолчанию
            </button>
            <button
              onClick={() => handleSortChange('createdAt')}
              className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${
                sortType === 'createdAt' ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-medium' : ''
              }`}
            >
              Дата создания {sortType === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSortChange('updatedAt')}
              className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${
                sortType === 'updatedAt' ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-medium' : ''
              }`}
            >
              Дата обновления {sortType === 'updatedAt' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

