import { auth } from '@/firebase/config'; // Assuming you have a firebase.js file with Firebase configuration
import { useEffect, useState } from 'react';

const useAuthState = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initialize loading state to true

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User is signed in
        setUser(authUser);
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false); // Set loading state to false once authentication status is determined
    });

    return () => unsubscribe();
  }, []);

  return { user, loading }; // Return both user and loading state
};

export default useAuthState;
