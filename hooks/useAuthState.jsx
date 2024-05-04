import { auth } from '@/firebase/config'; // Assuming you have a firebase.js file with Firebase configuration
import { useEffect, useState } from 'react';

const useAuthState = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User is signed in
        setUser(authUser);
      } else {
        // User is signed out
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return user;
};

export default useAuthState;
