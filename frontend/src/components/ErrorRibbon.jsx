import { useState, useEffect } from 'react';

const ErrorRibbon = ({ error }) => {
   const [isVisible, setIsVisible] = useState(false);

   useEffect(() => {
      if (error) {
         setIsVisible(true);
         const timer = setTimeout(() => setIsVisible(false), 5000);
         return () => clearTimeout(timer);
      }
   }, [error]);

   if (!isVisible || !error) return null;

   return (
      <div className="fixed bottom-0 left-0 right-0 bg-red-100 text-red-700 shadow-lg z-50 animate-fade-in-up">
         <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex-1 min-w-0">
               ⚠️{error}
            </div>
            <button
               onClick={() => setIsVisible(false)}
               className="ml-4 p-1 rounded-full hover:bg-red-300 transition-colors"
               aria-label="Dismiss error"
            >
               ✕
            </button>
         </div>
      </div>

      // {error && (
      //    <div>
      //       <div id="notificationId" className="fixed bottom-4 right-4 bg-red-500 font-semibold text-white px-4 py-2 rounded-md shadow-lg">
      //          ⚠️{error}
      //       </div>
      //       <script>
      //          {(() => hideNotification())()}
      //       </script>
      //    </div>
      // )}
   );
};

export default ErrorRibbon;
