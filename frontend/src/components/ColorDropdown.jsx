import { useState, useEffect, useRef } from 'react';

const ColorDropdown = ({selectedCategoryColor, setSelectedCategoryColor}) => {
   const [isOpen, setIsOpen] = useState(false);
   const dropdownRef = useRef(null);

   const levels = [
      { value: 'red', label: 'Red' },
      { value: 'orange', label: 'Orange' },
      { value: 'amber', label: 'Amber' },
      { value: 'yellow', label: 'Yellow' },
      { value: 'lime', label: 'Lime' },
      { value: 'green', label: 'Green' },
      { value: 'emerald', label: 'Emerald' },
      { value: 'teal', label: 'Teal' },
      { value: 'cyan', label: 'Cyan' },
      { value: 'sky', label: 'Sky' },
      { value: 'blue', label: 'Blue' },
      { value: 'indigo', label: 'Indigo' },
      { value: 'violet', label: 'Violet' },
      { value: 'purple', label: 'Purple' },
      { value: 'fuchsia', label: 'Fuchsia' },
      { value: 'pink', label: 'Pink' },
      { value: 'rose', label: 'Rose' },
      { value: 'slate', label: 'Slate' },
      { value: 'gray', label: 'Gray' },
      { value: 'zinc', label: 'Zinc' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'stone', label: 'Stone' }
   ];

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

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
         }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   const toggleDropdown = () => setIsOpen(!isOpen);
   const selectLevel = (category) => {
      setSelectedCategoryColor(category);
      setIsOpen(false);
   };

   return (
      <div className="" ref={dropdownRef}>
         <button
            type="button"
            onClick={toggleDropdown}
            className="w-full flex justify-between items-center px-2 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2"
         >
            {selectedCategoryColor ? <label className={`rounded-full border px-2 py-0.5 ${colorClasses[selectedCategoryColor] || ''}`}>
               {selectedCategoryColor.substring(0, 1).toUpperCase() + selectedCategoryColor.substring(1)}
            </label> : '.'}
            <svg
               className={`w-5 h-5 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
               xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 20 20"
               fill="currentColor"
            >
               <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
         </button>

         {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
               <ul className="py-1">
                  {levels.map((level) => (
                     <li
                        key={level.value}
                        onClick={() => selectLevel(level.value)}
                        className={`px-4 py-2 text-sm text-gray-700 cursor-pointer`}
                     >
                        <label className={`rounded-full border px-2 py-0.5 ${colorClasses[level.value] || ''}`}>
                           {level.label}
                        </label>
                     </li>
                  ))}
               </ul>
            </div>
         )}
      </div>
   );
};

export default ColorDropdown;
