const Pagination = ({ currentPage, totalPages, onPageChange, className }) => {
   return (
     <div className={`flex justify-center items-center ${className}`}>
       <button
         onClick={() => onPageChange(Math.max(0, currentPage - 1))}
         disabled={currentPage === 0}
         className="px-4 py-2 mx-1 border rounded disabled:opacity-50"
       >
         Previous
       </button>
       
       <span className="mx-4">
         Page {currentPage + 1} of {totalPages}
       </span>
       
       <button
         onClick={() => onPageChange(currentPage + 1)}
         disabled={currentPage >= totalPages - 1}
         className="px-4 py-2 mx-1 border rounded disabled:opacity-50"
       >
         Next
       </button>
     </div>
   );
 };
 
 export default Pagination;
 