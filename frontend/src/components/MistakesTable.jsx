import { createContext, useState, useRef, useEffect, cache } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/solid';
import CategoryDropdown from './CategoryDropdown';
import SeriousnessDropdown from '../components/SeriousnessDropdown';
import MistakesService from '../api/MistakesService';
import CategoryService from '../api/CategoryService';
import useNetworkData from '../NetworkDataContext';
import DeleteConfirmation from './DeleteConfirmation';

const MistakesTable = ({
   setError,
   setLoading
}) => {
   const dataContext = createContext();
   const [isOpen, setIsOpen] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');
   const dropdownRef = useRef(null);
   const [isEditOpen, setIsEditOpen] = useState(false);
   const [isAddOpen, setIsAddOpen] = useState(false);
   const [currentMistake, setCurrentMistake] = useState(null);
   const [selectedCategories, setSelectedCategories] = useState([]);
   const [mistakes, setMistakes] = useState([]);
   const [currentPageNumber, setPage] = useState(0);
   const [selectedLevel, setSelectedLevel] = useState('medium');
   const { getMistakes, createMistake, updateMistake, deleteMistake, incrementMistake, isLoading } = MistakesService();
   const { getCategories } = CategoryService();
   const [categoryOptions, setCategoryOptions] = useState([]);
   const { cacheMistakes, cacheCategories, setCacheMistakes, setCacheCategories } = useNetworkData();
   const [showDeletePopup, setShowDeletePopup] = useState(false);
   const [itemToDelete, setItemToDelete] = useState(null);
   const [formData, setFormData] = useState({
      name: '',
      category_ids: [],
      seriousness: '',
      description: '',
      lesson: '',
      made_by: 'Me',
      occurred_on: null
   });

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

   const handleAddNew = () => {
      setSelectedCategories([]);
      setCurrentMistake(null);
      setFormData({
         name: '',
         category_ids: selectedCategories,
         seriousness: '',
         description: '',
         lesson: '',
         made_by: 'Me',
         occurred_on: new Date().toISOString().split('T')[0]
      });
      setIsAddOpen(true);
   };

   useEffect(() => {
      cacheCategoriesAndFetchMistakes();
      const handleClickOutside = (event) => {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
         }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   const cacheCategoriesAndFetchMistakes = async () => {
      if (cacheCategories) {
         setCategoryOptions(buildCategoryOptions(cacheCategories));
         fetchMistakesUsingCacheOrNw();
         return;
      }
      setLoading(true);
      try {
         const categories = await getCategories();
         setCacheCategories(categories.items);
         setCategoryOptions(buildCategoryOptions(categories.items));
         setLoading(false);
         fetchMistakesUsingCacheOrNw();
      } catch (err) {
         setError(err.response?.data?.detail || 'Failed to fetch data');
         setLoading(false);
      }
   };

   const buildCategoryOptions = (cacheCategories) => {
      return cacheCategories.map(category => ({ label: category.name, value: category.id, color: category.color }))
   }

   const fetchMistakesUsingCacheOrNw = async () => {
      if (cacheMistakes) {
         setMistakes(cacheMistakes);
         setLoading(false);
         return;
      }
      fetchMistakesUsingNw();
   };

   const fetchMistakesUsingNw = async () => {
      const pageLimit = 100;
      setLoading(true);
      try {
         const mistakes = await getMistakes(currentPageNumber * pageLimit, pageLimit);
         setMistakes(mistakes.items);
         setCacheMistakes(mistakes.items);
         setLoading(false);
      } catch (err) {
         setError('Failed to fetch data');
         setLoading(false);
      }
   };

   const toggleOption = (value) => {
      const newSelectedValues = selectedValues.includes(value)
         ? selectedValues.filter(v => v !== value)
         : [...selectedValues, value];
      onChange(newSelectedValues);
   };

   const handleEdit = (person) => {
      setCurrentMistake(person);
      setFormData({
         name: person.name,
         title: person.title,
         email: person.email,
         role: person.role,
      });
      setIsEditOpen(true);
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
         ...prev,
         [name]: value,
      }));
   };

   const handleSeriousnessInputChange = (e) => {
      // const { seriousness, value } = e.target;
      formData.seriousness = e;
      // setFormData(prev => ({
      //    ...prev,
      //    [seriousness]: e,
      // }));
   };

   const handleDateChange = (e) => {
      // setDate(e.target.value);
      // formData.occurred_on = e.target.value;
      // const { occurred_on, value } = e.target.value;
      // setFormData(prev => ({
      //    ...prev,
      //    [occurred_on]: value,
      // }));
      setFormData({
         ...formData,
         occurred_on: e.target.value
      });
   };

   // Save changes
   const handleSave = () => {
      if (currentMistake) {
         // Update existing
         setPeople(mistakes.map(person =>
            person.id === currentMistake.id ? { ...person, ...formData } : person
         ));
      } else {
         // Add new
         // setPeople([...mistakes, { id: mistakes.length + 1, ...formData }]);
         saveButtonPressed();
      }
      setIsEditOpen(false);
      setIsAddOpen(false);
   };

   // Handle delete
   const handleDelete = (id) => {
      setPeople(mistakes.filter(mistake => mistake.id !== id));
   };

   const saveButtonPressed = async () => {
      setError('');
      setLoading(true);
      try {
         const data = await createMistake(formData.name, selectedCategories, formData.seriousness, formData.description, formData.lesson, formData.made_by, formData.occurred_on);
         setLoading(false);
         fetchMistakesUsingNw();
      } catch (err) {
         setError(err.response?.data?.detail || 'Failed to add new mistake');
         setLoading(false);
      }
   };

   const handleDeleteClick = (mistake) => {
      setItemToDelete(mistake);
      setShowDeletePopup(true);
   };

   const handleConfirmDelete = () => {
      deleteMistakeAsync();
      setShowDeletePopup(false);
      setItemToDelete(null);
   };

   const deleteMistakeAsync = async () => {
      setError('');
      setLoading(true);
      try {
         const data = await deleteMistake(itemToDelete.id);
         setLoading(false);
         fetchMistakesUsingNw();
      } catch (err) {
         setError(err.response?.data?.detail || 'Failed to delete mistake');
         setLoading(false);
      }
   }

   const handleCancelDelete = () => {
      setShowDeletePopup(false);
      setItemToDelete(null);
   };

   const handleMakeIrrelevant = () => {
      makeMistakeIrrelevantAsync();
      setShowDeletePopup(false);
      setItemToDelete(null);
   }

   const makeMistakeIrrelevantAsync = async () => {
   }

   const findCategoryNameForId = (categoryId) => {
      return cacheCategories.filter(category.id == categoryId).name;
   }

   const findCategoryColorForId = (categoryId) => {
      return cacheCategories.filter(category.id == categoryId).color;
   }

   return (
      <div className="px-4 sm:px-6 lg:px-8 pt-4">
         <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
               <h1 className="text-2xl font-semibold text-gray-900">Mistakes</h1>
               <p className="mt-2 text-sm text-gray-700">
               </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
               <button
                  type="button"
                  onClick={handleAddNew}
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
               >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Add New
               </button>
            </div>
         </div>
         <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
               <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-gray-300 ring-opacity-5 md:rounded-lg">
                     <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                           <tr>
                              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                 Name
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                 Count
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                 Category
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                 Seriousness
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                 Last Occoured
                              </th>
                              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                 <span className="sr-only">Action</span>
                              </th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                           {mistakes.map((mistake) => (
                              <tr key={mistake.id}>
                                 <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                                    {mistake.name}
                                 </td>
                                 <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {mistake.count}
                                 </td>
                                 <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {
                                       mistake.categories && mistake.categories.map((category_id) => (
                                          <label className={`rounded-full border px-2 py-0.5 ${colorClasses[findCategoryColorForId(category_id)] || ''}`}>
                                             {findCategoryNameForId(category_id)}
                                          </label>
                                       ))
                                    }
                                 </td>
                                 <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {mistake.seriousness}
                                 </td>
                                 <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {mistake.last_occurred_at}
                                 </td>
                                 <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                    <button
                                       onClick={() => handleEdit(mistake)}
                                       className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                       {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
</svg> */}
                                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                       </svg>
                                    </button>
                                    <button
                                       onClick={() => handleEdit(mistake)}
                                       className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                       <PencilIcon className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                    <button
                                       onClick={() => handleDeleteClick(mistake)}
                                       className="text-red-600 hover:text-red-900"
                                    >
                                       <TrashIcon className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         </div>

         {(isEditOpen || isAddOpen) && (
            <div className="fixed z-10 inset-0 overflow-y-auto">
               <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  <div className="fixed inset-0 transition-opacity" aria-hidden="true"
                     onClick={() => {
                        setIsEditOpen(false);
                        setIsAddOpen(false);
                     }}>
                     <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                  </div>
                  <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                  <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
                     onClick={(e) => e.stopPropagation()}>
                     <div>
                        <div className="">
                           <h3 className="text-lg leading-6 font-medium text-gray-900">
                              {currentMistake ? 'Edit User' : 'Add New Mistake'}
                           </h3>
                           <div className="mt-2">
                              <div className="space-y-4">
                                 <div>
                                    <label htmlFor="nameId" className="block text-sm font-medium text-gray-700">
                                       What would you name this mistake?
                                    </label>
                                    <input
                                       type="text"
                                       name="name"
                                       id="nameId"
                                       value={formData.name}
                                       onChange={handleInputChange}
                                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                       autoComplete='off'
                                    />
                                 </div>
                                 <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                       In which categories does it fall?
                                    </label>
                                    <div className="mx-auto">
                                       <CategoryDropdown
                                          options={categoryOptions}
                                          selectedValues={selectedCategories}
                                          onChange={setSelectedCategories}
                                       />
                                    </div>
                                 </div>
                                 <div>
                                    <label htmlFor="seriousness" className="block text-sm font-medium text-gray-700">
                                       How serious was it?
                                    </label>
                                    <div className="">
                                       <SeriousnessDropdown
                                          onChange={handleSeriousnessInputChange}
                                       />
                                    </div>
                                 </div>
                                 <div>
                                    <label htmlFor="madeById" className="block text-sm font-medium text-gray-700">
                                       Who made this mistake?
                                    </label>
                                    <input
                                       type="text"
                                       id="madeById"
                                       name="madeBy"
                                       value={formData.made_by}
                                       onChange={handleInputChange}
                                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                       autoComplete='off'
                                    />
                                 </div>
                                 <div>
                                    <div className="">
                                       <label htmlFor="occurredOnId" className="block text-sm font-medium text-gray-700 mb-1">
                                          On which date did it occour?
                                       </label>
                                       <input
                                          type="date"
                                          id="occurredOnId"
                                          name="occurred_on"
                                          value={formData.occurred_on}
                                          onChange={handleDateChange}
                                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                       />
                                    </div>
                                 </div>
                                 <div>
                                    <label htmlFor="descriptionId" className="block text-sm font-medium text-gray-700">
                                       What happened that day?
                                    </label>
                                    <input
                                       type="text"
                                       id="descriptionId"
                                       name="description"
                                       value={formData.description}
                                       onChange={handleInputChange}
                                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                       autoComplete='off'
                                    />
                                 </div>
                                 <div>
                                    <label htmlFor="lessonId" className="block text-sm font-medium text-gray-700">
                                       What did you learn?
                                    </label>
                                    <input
                                       type="text"
                                       id="lessonId"
                                       name="lesson"
                                       value={formData.lesson}
                                       onChange={handleInputChange}
                                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                       autoComplete='off'
                                    />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                           type="button"
                           onClick={handleSave}
                           className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                        >
                           Save
                        </button>
                        <button
                           type="button"
                           onClick={() => {
                              setIsEditOpen(false);
                              setIsAddOpen(false);
                           }}
                           className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                        >
                           Cancel
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}
         {/* <Pagination 
          currentPage={page}
          totalPages={Math.ceil(mistakes.length / limit)}
          onPageChange={setPage}
          className="mt-4"
        /> */}
         {showDeletePopup && (
            <DeleteConfirmation
               itemName={itemToDelete.name}
               onConfirm={handleConfirmDelete}
               onCancel={handleCancelDelete}
            />
         )}
      </div>
   );
};

export default MistakesTable;
