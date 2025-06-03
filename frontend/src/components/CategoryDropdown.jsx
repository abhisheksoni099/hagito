import { useState, useRef, useEffect } from 'react';

const CategoryDropdown = ({ 
  options, 
  selectedValues, 
  onChange, 
  placeholder = "." 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleOption = (value) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newSelectedValues);
  };

  const colorClasses = {
   red: 'border-red-100 bg-red-50 text-red-800 dark:text-red-300 dark:border-red-500/15 dark:bg-red-500/10',
   orange: 'border-orange-100 bg-orange-50 text-orange-800 dark:text-orange-300 dark:border-orange-500/15 dark:bg-orange-500/10',
   amber: 'border-amber-100 bg-amber-50 text-amber-800 dark:text-amber-300 dark:border-amber-500/15 dark:bg-amber-500/10',
   yellow: 'border-yellow-100 bg-yellow-50 text-yellow-800 dark:text-yellow-300 dark:border-yellow-500/15 dark:bg-yellow-500/10',
   lime: 'border-lime-100 bg-lime-50 text-lime-800 dark:text-lime-300 dark:border-lime-500/15 dark:bg-lime-500/10',
   green: 'border-green-100 bg-green-50 text-green-800 dark:text-green-300 dark:border-green-500/15 dark:bg-green-500/10',
   emerald: 'border-emerald-100 bg-emerald-50 text-emerald-800 dark:text-emerald-300 dark:border-emerald-500/15 dark:bg-emerald-500/10',
   teal: 'border-teal-100 bg-teal-50 text-teal-800 dark:text-teal-300 dark:border-teal-500/15 dark:bg-teal-500/10',
   cyan: 'border-cyan-100 bg-cyan-50 text-cyan-800 dark:text-cyan-300 dark:border-cyan-500/15 dark:bg-cyan-500/10',
   sky: 'border-sky-100 bg-sky-50 text-sky-800 dark:text-sky-300 dark:border-sky-500/15 dark:bg-sky-500/10',
   blue: 'border-blue-100 bg-blue-50 text-blue-800 dark:text-blue-300 dark:border-blue-500/15 dark:bg-blue-500/10',
   indigo: 'border-indigo-100 bg-indigo-50 text-indigo-800 dark:text-indigo-300 dark:border-indigo-500/15 dark:bg-indigo-500/10',
   violet: 'border-violet-100 bg-violet-50 text-violet-800 dark:text-violet-300 dark:border-violet-500/15 dark:bg-violet-500/10',
   purple: 'border-purple-100 bg-purple-50 text-purple-800 dark:text-purple-300 dark:border-purple-500/15 dark:bg-purple-500/10',
   fuchsia: 'border-fuchsia-100 bg-fuchsia-50 text-fuchsia-800 dark:text-fuchsia-300 dark:border-fuchsia-500/15 dark:bg-fuchsia-500/10',
   pink: 'border-pink-100 bg-pink-50 text-pink-800 dark:text-pink-300 dark:border-pink-500/15 dark:bg-pink-500/10',
   rose: 'border-rose-100 bg-rose-50 text-rose-800 dark:text-rose-300 dark:border-rose-500/15 dark:bg-rose-500/10',
   slate: 'border-slate-100 bg-slate-50 text-slate-800 dark:text-slate-300 dark:border-slate-500/15 dark:bg-slate-500/10',
   gray: 'border-gray-100 bg-gray-50 text-gray-800 dark:text-gray-300 dark:border-gray-500/15 dark:bg-gray-500/10',
   zinc: 'border-zinc-100 bg-zinc-50 text-zinc-800 dark:text-zinc-300 dark:border-zinc-500/15 dark:bg-zinc-500/10',
   neutral: 'border-neutral-100 bg-neutral-50 text-neutral-800 dark:text-neutral-300 dark:border-neutral-500/15 dark:bg-neutral-500/10',
   stone: 'border-stone-100 bg-stone-50 text-stone-800 dark:text-stone-300 dark:border-stone-500/15 dark:bg-stone-500/10'
};

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
      //   className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md cursor-pointer bg-white min-h-10"
        className="flex flex-wrap items-center gap-2 p-2 mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedValues.length === 0 ? (
          <span className="text-gray-400">{placeholder}</span>
        ) : (
          selectedValues.map(value => {
            const option = options.find(opt => opt.value === value);
            return (
              <span 
                key={value} 
                className={`inline-flex items-center px-2 py-1 ${colorClasses[option.color] || ''} rounded-full text-sm`}
              >
                <label className={`rounded-full border px-2 ${colorClasses[option.color] || ''}`}>
                     {option?.label}
                  </label>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(value);
                  }}
                  className="ml-1 text-blue-900 hover:text-blue-900"
                >
                  &times;
                </button>
              </span>
            );
          })
        )}
        <div className="ml-auto">
          <svg 
            className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Search..."
            //   className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center p-2 hover:bg-blue-50 cursor-pointer ${selectedValues.includes(option.value) ? 'bg-blue-100' : ''}`}
                  onClick={() => toggleOption(option.value)}
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.value)}
                    readOnly
                    className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label className={`rounded-full border px-2 ${colorClasses[option.color] || ''}`}>
                     {option.label}
                  </label>
                </div>
              ))
            ) : (
              <div className="p-2 text-gray-500">No options found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
