import { useState, useRef, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/solid';
import CategoryDropdown from './CategoryDropdown';
import SeriousnessDropdown from './SeriousnessDropdown';
import ColorDropdown from './ColorDropdown';
import CategoryService from '../api/CategoryService';
import DeleteConfirmation from './DeleteConfirmation';
import useNetworkData from '../NetworkDataContext';

const CategoryTable = ({
   setError,
   setLoading
}) => {
   const [isOpen, setIsOpen] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');
   const dropdownRef = useRef(null);
   const [isEditOpen, setIsEditOpen] = useState(false);
   const [isAddOpen, setIsAddOpen] = useState(false);
   const [isEditMode, setIsEditMode] = useState(null);
   const [selectedItems, setSelectedItems] = useState([]);
   const [categories, setCategories] = useState([]);
   const [currentPageNumber, setPage] = useState(0);
   const {getCategories, createCategory, updateCategory, deleteCategory, isLoading} = CategoryService();
   const [categoryOptions, setOptions] = useState([]);
   const [selectedCategory, setSelectedCategory] = useState(null);
   const [selectedCategoryColor, setSelectedCategoryColor] = useState(null);
   const [showDeletePopup, setShowDeletePopup] = useState(false);
   const [itemToDelete, setItemToDelete] = useState(null);
   const { cacheMistakes, cacheCategories, setCacheMistakes, setCacheCategories } = useNetworkData();
   const [formData, setFormData] = useState({
      name: '',
      color: ''
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

  const handleDeleteClick = (category) => {
    setItemToDelete(category);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
   setError('');
   deleteCategoryNow();
    setShowDeletePopup(false);
    setItemToDelete(null);
  };

  const deleteCategoryNow = async () => {
   setLoading(true);
      try {
         const data = await deleteCategory(itemToDelete.id);
         setLoading(false);
         fetchCategories();
      } catch (err) {
         setError(err.response?.data?.detail || 'Failed to delete category');
         setLoading(false);
      }
  }

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setItemToDelete(null);
  };

   useEffect(() => {
      setCategories(cacheCategories);
      // fetchCategories();
      const handleClickOutside = (event) => {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
         }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   const fetchCategories = async () => {
      setLoading(true);
      try {
         const categories = await getCategories();
         setCategories(categories.items);
         setCacheCategories(categories.items);
         setLoading(false);
      } catch (err) {
         setError(err.response?.data?.detail || 'Failed to fetch data');
         setLoading(false);
      }
   };

   const toggleOption = (value) => {
      const newSelectedValues = selectedValues.includes(value)
         ? selectedValues.filter(v => v !== value)
         : [...selectedValues, value];
      onChange(newSelectedValues);
   };

   const handleAddNew = () => {
      setIsEditMode(false);
      setSelectedCategory(null);
      setSelectedCategoryColor('gray');
      setFormData({
         name: ''
      });
      setIsAddOpen(true);
   };

   const handleEdit = (category) => {
      setIsEditMode(true);
      setSelectedCategory(category);
      setSelectedCategoryColor(category.color);
      setFormData({
         name: category.name,
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

   const handleDateChange = (e) => {
      setDate(e.target.value);
   };

   // Save changes
   const handleSave = () => {
      if (isEditMode) {
         editExisingCategory();
      } else {
         createNewCategory();
      }
      setIsEditOpen(false);
      setIsAddOpen(false);
   };

   // Handle delete
   const handleDelete = (id) => {
      //setPeople(categories.filter(mistake => mistake.id !== id));

   };

   const createNewCategory = async () => {
      setError('');
      setLoading(true);
      try {
         const data = await createCategory(formData.name, selectedCategoryColor);
         setLoading(false);
         fetchCategories();
      } catch (err) {
         setError(err.response?.data?.detail || 'Failed to add new category');
         setLoading(false);
      }
   };

   const editExisingCategory = async () => {
      setLoading(true);
      try {
         const data = await updateCategory(selectedCategory.id, formData.name, selectedCategoryColor);
         setLoading(false);
         fetchCategories();
      } catch (err) {
         setError(err.response?.data?.detail || 'Failed to update categories');
         setLoading(false);
      }
   };

   return (
      <div className="px-4 sm:px-6 lg:px-8 pt-4">
         <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
               <h1 className="text-2xl font-semibold text-gray-900">Cagtegories</h1>
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
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                 Category
                              </th>
                              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                 <span className="sr-only">Action</span>
                              </th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                           {categories.map((category) => (
                              <tr key={category.id}>
                                 <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    <label className={`rounded-full border px-2 py-0.5 ${colorClasses[category.color] || ''}`}>
                                       {category.name}
                                    </label>
                                 </td>
                                 <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                    <button
                                       onClick={() => handleEdit(category)}
                                       className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                       <PencilIcon className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                    <button
                                       onClick={() => handleDeleteClick(category)}
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
                              {isEditMode ? 'Edit Category' : 'Add New Category'}
                           </h3>
                           <div className="mt-2">
                              <div className="space-y-4">
                                 <div>
                                    <label htmlFor="nameId" className="block text-sm font-medium text-gray-700">
                                       Name
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
                                    <label htmlFor="seriousness" className="block text-sm font-medium text-gray-700">
                                       Color
                                    </label>
                                    <div className="">
                                       <ColorDropdown
                                          selectedCategoryColor={selectedCategoryColor}
                                          setSelectedCategoryColor={setSelectedCategoryColor}
                                       />
                                    </div>
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

export default CategoryTable;
