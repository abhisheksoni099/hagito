import React from 'react';

const ProgressBar = ({isLoading}) => {
   const size = 80;

   if (!isLoading) return null;

   return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-30">
         <div
            className="flex justify-center items-center"
            role="status"
            aria-label="Loading"
         >
            <svg
               className="animate-spin"
               width={size}
               height={size}
               viewBox="0 0 120 120"
               fill="none"
               xmlns="http://www.w3.org/2000/svg"
               style={{ animationDuration: '3s' }}
            >
               <circle cx="60" cy="60" r="55" fill="#3B82F6" fillOpacity="0.2" />

               <circle
                  cx="60"
                  cy="15"
                  r="12"
                  fill="#3B82F6"
                  className="motion-safe:animate-pulse"
               />
               <circle
                  cx="105"
                  cy="60"
                  r="12"
                  fill="#3B82F6"
                  fillOpacity="0.6"
               />
               <circle
                  cx="60"
                  cy="105"
                  r="12"
                  fill="#3B82F6"
                  fillOpacity="0.3"
               />
               <path
                  d="M40 75 Q60 90 80 75"
                  stroke="white"
                  strokeWidth="4"
                  fill="pink"
                  className="!transform-none"
               />
            </svg>
         </div>
      </div>
   );
};

export default ProgressBar;
