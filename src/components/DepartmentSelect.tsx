'use client';
import { useState, useRef, useEffect } from 'react';

const departments = [
  { group: 'Departments', options: [
    { value: 'technology', label: 'Technology' },
    { value: 'administration', label: 'Administration' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'finance', label: 'Finance & Accounting' },
    { value: 'operations', label: 'Operations' },
    { value: 'customer_service', label: 'Customer Service' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'security', label: 'Security & Safety' }
  ]}
];

export default function DepartmentSelect({ value, onChange, placeholder }: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = departments
    .flatMap(group => group.options)
    .find(option => option.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="input-field cursor-pointer flex justify-between items-center"
      >
        <span className={selectedOption ? 'text-white' : 'text-gray-500'}>
          {selectedOption?.label || placeholder}
        </span>
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-white/10 rounded-lg shadow-xl">
          <input
            type="text"
            className="w-full p-2 border-b border-white/10 bg-transparent text-white placeholder-gray-400 focus:outline-none"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="max-h-60 overflow-auto">
            {departments.map((group) => {
              const filteredOptions = group.options.filter(option =>
                option.label.toLowerCase().includes(search.toLowerCase())
              );

              if (filteredOptions.length === 0) return null;

              return (
                <div key={group.group}>
                  <div className="px-2 py-1 bg-slate-700/50 text-sm font-medium text-gray-300">
                    {group.group}
                  </div>
                  {filteredOptions.map((option) => (
                    <div
                      key={option.value}
                      className="px-4 py-2 cursor-pointer hover:bg-white/5 text-white"
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                        setSearch('');
                      }}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}