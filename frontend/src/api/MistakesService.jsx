import { useState } from 'react';
import axios from 'axios';

const MistakesService = () => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API = axios.create({
    baseURL: import.meta.env.REACT_APP_API_URL || 'http://localhost:8000',
  });

  const getMistakes = async (skip = 0, limit = 10, sortBy = 'name', sortDir = 'asc') => {
    setLoading(true);
    try {
      const response = await API.get('/mistakes/', {
        params: { skip, limit, sort_by: sortBy, sort_dir: sortDir }
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch mistakes');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createMistake = async (name, category_ids, seriousness, description, lesson, made_by, occourred_on) => {
    setLoading(true);
    try {
      const response = await API.post('/mistakes/', { name, category_ids, seriousness, description, lesson, made_by, occourred_on });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create mistake');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteMistake = async (id) => {
   setLoading(true);
   try {
      const response = await API.delete('/mistakes/' + id);
      return response.data;
   } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete mistake');
      throw err;
   } finally {
      setLoading(false);
   }
};

  const incrementMistake = async (id, comment = null) => {
    setLoading(true);
    try {
      const response = await API.post(`/mistakes/${id}/increment`, { comment });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to increment mistake');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { getMistakes, createMistake, deleteMistake, incrementMistake, loading: isLoading, error };
};

export default MistakesService;
