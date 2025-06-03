import { useState } from 'react';

const DeleteConfirmation = ({
   itemName,
   onConfirm,
   onCancel
}) => {
   return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
         {/* Transparent background */}
         <div
            //   className="absolute inset-0 bg-transparent"
            className="absolute inset-0 bg-gray-500 opacity-75"
            onClick={onCancel}
         ></div>

         {/* Popup container */}
         <div className="relative bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
               Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
               Are you sure you want to delete {itemName}?
            </p>
            <div className="flex justify-end space-x-3">
               <button
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
               >
                  Cancel
               </button>
               <button
                  onClick={onConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
               >
                  Delete
               </button>
            </div>
         </div>
      </div>
   );
};

export default DeleteConfirmation;
