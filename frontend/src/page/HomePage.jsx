import { useState } from 'react';
import NavBar from '../components/NavBar';
import MistakesTable from '../components/MistakesTable';
import ErrorRibbon from '../components/ErrorRibbon';
import ProgressBar from '../components/ProgressBar';
import CategoryTable from '../components/CategoryTable';

const HomePage = () => {
   const [error, setError] = useState('');
   const [isLoading, setLoading] = useState(false);
   const [currentTab, setCurrentTab] = useState('Home');

   return (
      <div>
         <NavBar currentTab={currentTab} setCurrentTab={setCurrentTab}></NavBar>
         <ErrorRibbon error={error}></ErrorRibbon>
         <ProgressBar isLoading={isLoading}/>
         {(currentTab == 'Home') && (
            <MistakesTable setError={setError} setLoading={setLoading}></MistakesTable>
         )}
         {(currentTab == 'Settings') && (
            <CategoryTable setError={setError} setLoading={setLoading}></CategoryTable>
         )}
      </div>
   );
};

export default HomePage;
