'use client'

import { useRouter } from "next/navigation"

export default function LovedBox({ children }) {
	const router = useRouter();

	  // Dummy function to simulate authentication status (replace with your logic)
	  const isAuthenticated = () => {
		return !!localStorage.getItem('accToken'); // example
	  };
	
	const handleClick = (e) => {
		e.preventDefault(); // Prevent any default behavior (if necessary)
		if (isAuthenticated()) {
		  router.push(`/create-card`); // If authenticated, navigate to the send-loved page
		} else {
		  localStorage.setItem('sendLoveUrl', `/create-card`); // Save URL for redirection after login
	      router.push('/login'); // Redirect to login if not authenticated
		}
	  };
	 
	  
	return (
		<div onClick={handleClick}  className="cursor-pointer shadow-md w-[500px] max-w-[500] xl:max-w-[550px] rounded-[64px] overflow-hidden">
			{children}
		</div>
	)
}
