import Image from "next/image";
import MansIcon from "@/public/mans-icon.svg";

export default function UserInfo({ username, register, email, errors }) {
  // Validates and formats the username input field
  const handleUsernameInput = (event) => {
    const regex = /^[a-zA-Z\s-]*$/; // Allow letters, spaces, and hyphens
    if (!regex.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^a-zA-Z\s-]/g, ""); // Remove all characters except letters, spaces, and hyphens
    }
  };

  return (
    <div className="customSection">
    {username ? (
      <div className="inline-flex items-center justify-center px-3 mb-4 py-1 text-black border border-gray-300 rounded-full bg-pink-400">
        {username}
      </div>
    ) : (
                    <div className="mb-8">
                    <label htmlFor="from" className="block text-sm font-medium text-gray-700 pb-4">
                        From
                    </label>
                        <input
                        value={username || ""}
                        {...register("username", {
                          required: "Username is required",
                          pattern: {
                            value: /^[a-zA-Z\s]+$/,
                            message: "Only letters and spaces are allowed",
                          },
                        })}
                        onInput={handleUsernameInput}

                            type="text"
                            id="from"
                            placeholder="Your name"
                            className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm user-name-input"
                        />
                          {errors.username && <p className="mt-1 text-xs text-red-500 ml-[10px]">{errors.username.message}</p>} 
                        </div>


                      )}
                {!email && (

                        <div className="mb-8">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 pb-4">

                            Email
                        </label>
                        <input
                         {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                              message: "Invalid email address",
                            },
                          })}
                            type="email"
                            id="email"
                            placeholder="Your email"
                            className="email-input block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        />
                           {errors.email && <p className="mt-1 text-xs text-red-500 ml-[10px]">{errors.email.message}</p>}
                           </div>
                  )} 
        </div>
  );
}
