'use client'
import { useEffect, useState } from 'react';
import useApiCaller from './useApiCaller';

const useAuthState = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initialize loading state to true

  const apiCaller = useApiCaller()
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem('accToken') : false;
    const getUser = async () => {
      try {
        const res = await apiCaller.post('/sign-up/api/check_token_valid')

        if (res.data.result) {
          setUser(res?.data?.data)
        } else {
          setUser(null)
        }
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }

    if (token) {
      getUser();
    }

  }, [apiCaller]);

  return { user, loading }; // Return both user and loading state
};

export default useAuthState;
