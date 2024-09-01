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
    <div className="inputDiv">
      <div className="flex relative mt-5 max-w-[330px] items-center rounded-[25px] bg-[#F1F1F1] p-4">
        <div className="flex items-center">
          <Image src={MansIcon} alt="Info" className="mr-2" width={17} height={17} />
          <span className="text-[#2E266F]">From</span>
        </div>
        <div className="ml-4 flex-1 text-right">
        {username ? (
            <div className="inline-flex items-center justify-center px-3 py-1 text-black border border-gray-300 rounded-full">
              {username}
            </div>
          ) : (
            <div className="form-group relative mb-2">
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
                className={`w-full rounded-full bg-[#F1F1F1] p-2 pl-4 text-right`}
                type="text"
                placeholder="Name"
              />
            </div>
          )}
          {!email && (
            <div className="form-group relative mb-2">
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
                className="w-full rounded-full bg-[#F1F1F1] p-2 pl-4 text-right"
                type="email"
                placeholder="Email"
              />
            </div>
          )}
        </div>
      </div>
      {errors.username && <p className="mt-1 text-xs text-red-500 ml-[10px]">{errors.username.message}</p>}
      {errors.email && <p className="mt-1 text-xs text-red-500 ml-[10px]">{errors.email.message}</p>}
    </div>
  );
}
