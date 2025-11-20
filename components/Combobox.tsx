
import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

interface Option {
  value: string | number;
  label: string;
}

interface ComboboxProps {
  options: Option[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  className?: string;
}

const Combobox: React.FC<ComboboxProps> = ({ options, value, onChange, placeholder = 'انتخاب کنید...', className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-right bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg flex justify-between items-center focus:ring-2 focus:ring-primary-500 outline-none"
      >
        <span className={selectedOption ? 'text-gray-800 dark:text-white' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronsUpDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
          <input
            type="text"
            className="w-full p-2 border-b dark:border-gray-600 dark:bg-gray-800 dark:text-white outline-none text-sm"
            placeholder="جستجو..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          {filteredOptions.length > 0 ? (
            <ul>
              {filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`px-4 py-2 cursor-pointer text-sm flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-600 ${
                    value === option.value ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'text-gray-700 dark:text-gray-200'
                  }`}
                >
                  {option.label}
                  {value === option.value && <Check className="w-4 h-4" />}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-sm text-gray-500 text-center">موردی یافت نشد</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Combobox;
