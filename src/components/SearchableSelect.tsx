'use client';
import { useState, useRef, useEffect } from 'react';

const designations = [
  { group: 'Leadership', options: [
    { value: 'ceo', label: 'CEO & Co-Founder' },
    { value: 'coo', label: 'COO - Co-Founder' }
  ]},
  { group: 'Management', options: [
    { value: 'assistant_manager', label: 'Assistant Manager' },
    { value: 'manager', label: 'Manager' },
    { value: 'sr_manager', label: 'Sr Manager' },
    { value: 'brand_manager', label: 'Brand Manager' },
    { value: 'team_leader', label: 'Team Leader' },
    { value: 'service_manager', label: 'Service Manager' },
    { value: 'account_manager', label: 'Account Manager' },
    { value: 'development_manager', label: 'Development Manager' }
  ]},
  { group: 'Development', options: [
    { value: 'jr_developer', label: 'Jr Developer' },
    { value: 'developer', label: 'Developer' },
    { value: 'sr_developer', label: 'Sr Developer' }
  ]},
  { group: 'IT', options: [
    { value: 'jr_it_admin', label: 'Jr IT Admin' },
    { value: 'it_admin', label: 'IT Admin' },
    { value: 'sr_it_admin', label: 'Sr IT Admin' }
  ]},
  { group: 'Accounting', options: [
    { value: 'jr_accountant', label: 'Jr Accountant' },
    { value: 'accountant', label: 'Accountant' },
    { value: 'sr_accountant', label: 'Sr Accountant' }
  ]},
  { group: 'Customer Service', options: [
    { value: 'cso', label: 'Customer Service Officer' },
    { value: 'sr_cso', label: 'Sr. Customer Service Officer' }
  ]},
  { group: 'Executive', options: [
    { value: 'jr_executive', label: 'Jr Executive' },
    { value: 'executive', label: 'Executive' },
    { value: 'sr_executive', label: 'Sr Executive' }
  ]},
  { group: 'Associate', options: [
    { value: 'jr_associate', label: 'Jr Associate' },
    { value: 'associate', label: 'Associate' },
    { value: 'sr_associate', label: 'Sr Associate' }
  ]}
];

export default function SearchableSelect({ value, onChange, placeholder }: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = designations
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
            {designations.map((group) => {
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