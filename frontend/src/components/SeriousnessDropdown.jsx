import { useState, useEffect, useRef } from 'react';

const SeriousnessDropdown = ({
   onChange
}) => {
  const [selectedLevel, setSelectedLevel] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const levels = [
    { value: 'slip', label: 'Slip - Minor' },
    { value: 'stumble', label: 'Stumble - Noticeable' },
    { value: 'blunder', label: 'Blunder - Costly' },
    { value: 'crisis', label: 'Crisis - Severe' },
    { value: 'catastrophe', label: 'Catastrophe - Existential' }
  ];

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
  const selectLevel = (level) => {
    setSelectedLevel(level);
    setIsOpen(false);
    onChange(level);
  };

  return (
    <div className="" ref={dropdownRef}>
      {/* Dropdown button */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full flex justify-between items-center px-4 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {selectedLevel ? levels.find(l => l.value === selectedLevel)?.label : '.'}
        <svg
          className={`w-5 h-5 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <ul className="py-1">
            {levels.map((level) => (
              <li
                key={level.value}
                onClick={() => selectLevel(level.value)}
                className={`px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-blue-50 ${
                  selectedLevel === level.value ? 'bg-blue-100' : ''
                }`}
              >
                {level.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SeriousnessDropdown;
