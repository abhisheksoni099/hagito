import { useState } from 'react';
import axios from 'axios';

const CategoryService = () => {
   const [isLoading, setLoading] = useState(false);
   const [error, setError] = useState(null);

   const API = axios.create({
      baseURL: import.meta.env.REACT_APP_API_URL || 'http://localhost:8000/categories',
   });

   const getCategories = async () => {
      setLoading(true);
      try {
         const response = await API.get('/', {
            params: {}
         });
         return response.data;
      } catch (err) {
         setError(err.response?.data?.detail || 'Failed to fetch categories');
         throw err;
      } finally {
         setLoading(false);
      }
   };

   const createCategory = async (name, color) => {
      setLoading(true);
      try {
         const response = await API.post('/', { name, color });
         return response.data;
      } catch (err) {
         setError(err.response?.data?.detail || 'Failed to create category');
         throw err;
      } finally {
         setLoading(false);
      }
   };

   const updateCategory = async (id, name, color) => {
      setLoading(true);
      try {
         const response = await API.put('/' + id, { name, color });
         return response.data;
      } catch (err) {
         setError(err.response?.data?.detail || 'Failed to update category');
         throw err;
      } finally {
         setLoading(false);
      }
   };

   const deleteCategory = async (id) => {
      setLoading(true);
      try {
         const response = await API.delete('/' + id);
         return response.data;
      } catch (err) {
         setError(err.response?.data?.detail || 'Failed to delete category');
         throw err;
      } finally {
         setLoading(false);
      }
   };

   return { getCategories, createCategory, updateCategory, deleteCategory, isLoading, error };
};

export default CategoryService;
