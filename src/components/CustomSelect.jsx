import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({ value, onChange, options, label, className = '', selectClass = 'h-14' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options?.find(opt => opt.value === value) || options?.[0];

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-[10px] uppercase font-bold text-sage mb-1.5">{label}</label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white dark:bg-charcoalDark rounded-lg px-4 font-body text-sm font-medium text-charcoalDark dark:text-white outline-none border border-charcoalDark/20 dark:border-white/10 focus:border-aqua transition-all flex items-center justify-between shadow-sm hover:border-aqua/50 ${selectClass}`}
      >
        <span className="truncate text-left">{selectedOption ? selectedOption.label : 'Select option...'}</span>
        <ChevronDown className={`w-4 h-4 text-sage transition-transform duration-300 ${isOpen ? 'rotate-180 text-aqua' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-charcoalDark border border-charcoalDark/10 dark:border-white/10 rounded-xl shadow-xl z-[999] max-h-60 overflow-y-auto custom-scroll py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          {options?.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange({ target: { value: opt.value } });
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm font-body font-medium flex items-center justify-between transition-colors
                  ${isSelected 
                    ? 'bg-aqua/10 text-aqua dark:bg-aqua/20' 
                    : 'text-charcoalDark dark:text-white/80 hover:bg-charcoalDark/5 dark:hover:bg-white/5'
                  }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check className="w-4 h-4 text-aqua shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
