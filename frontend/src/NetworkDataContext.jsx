import { createContext, useContext, useState } from 'react';

// Create context with default value
const NetworkDataContext = createContext({
  cacheMistakes: null,
  cacheCategories: null,
  setCacheMistakes: () => {},
  setCacheCategories: () => {},
  clearNetworkData: () => {}
});

// Context Provider Component
export function NetworkDataProvider({ children }) {
  const [cacheMistakes, setCacheMistakes] = useState();
  const [cacheCategories, setCacheCategories] = useState([]);

  const clearNetworkData = () => {
    setCacheMistakes(null);
  };

  return (
    <NetworkDataContext.Provider 
      value={{ cacheMistakes, cacheCategories, setCacheMistakes, setCacheCategories, clearNetworkData }}
    >
      {children}
    </NetworkDataContext.Provider>
  );
}

// Custom hook for easy access
export default function useNetworkData() {
  return useContext(NetworkDataContext);
}
