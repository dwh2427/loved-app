import Image from "next/image";
import MansIcon from "@/public/mans-icon.svg";

export default function UserInfo({ username, register, handleUsernameInput, email, errors }) {
  return (
    <div className="relative mt-5 flex max-w-[330px] items-center rounded-[25px] bg-[#F1F1F1] p-4">
      <div className="flex items-center">
        <Image src={MansIcon} alt="Info" className="mr-2" width={17} height={17} />
        <span className="text-[#2E266F]">From</span>
      </div>
      <div className="ml-4 flex-1">
        <div className="form-group relative mb-2">
          <input
            value={username}
            {...register("username", {
              pattern: {
                value: /^[a-zA-Z-]+$/,
                message: "Only letters and hyphens are allowed",
              },
            })}
            onInput={handleUsernameInput}
            className={`w-full rounded-full bg-[#F1F1F1] p-2 pl-4 text-right`}
            type="text"
            placeholder="Name"
          />
        </div>
        <div className="form-group relative">
          <input
            value={email}
            {...register("email")}
            className={`w-full rounded-full bg-[#F1F1F1] p-2 pl-4 text-right`}
            type="email"
            placeholder="Email"
          />
        </div>
      </div>
      {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
    </div>
  );
}
