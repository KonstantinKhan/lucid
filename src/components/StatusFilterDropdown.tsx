'use client';

import { useState, useRef, useEffect } from 'react';

interface StatusOption {
  id: string;
  title: string;
}

interface StatusFilterDropdownProps {
  selectedStatuses: string[];
  onChange: (statusId: string) => void;
  onClear: () => void;
  allStatuses: StatusOption[];
}

export default function StatusFilterDropdown({
  selectedStatuses,
  onChange,
  onClear,
  allStatuses,
}: StatusFilterDropdownProps) {
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

  const selectedCount = selectedStatuses.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="neomorphic-card px-4 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all flex items-center gap-2"
      >
        <span>Статусы</span>
        {selectedCount > 0 && (
          <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center">
            {selectedCount}
          </span>
        )}
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
        <div className="absolute right-0 mt-2 w-48 neomorphic-card rounded-lg shadow-lg z-10 p-2">
          <div className="space-y-1">
            <label className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={selectedStatuses.length === 0}
                onChange={onClear}
                className="neomorphic-checkbox"
              />
              <span className="text-sm">Все</span>
            </label>
            {allStatuses.map(({ id, title }) => (
              <label 
                key={id} 
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes(id)}
                  onChange={() => onChange(id)}
                  className="neomorphic-checkbox"
                />
                <span className="text-sm">{title}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

