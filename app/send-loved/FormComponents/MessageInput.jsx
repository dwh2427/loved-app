import Image from "next/image";
import MessageIcon from "@/public/message-icon.svg";

export default function MessageInput({ text, register, errors }) {
  return (
    <div className="form-group relative my-5">
      <textarea
        {...register("text")}
        value={text}
        rows={4}
        className="w-[330px] resize-none rounded-[25px] bg-[#F1F1F1] p-3 pl-10"
        type="text"
        placeholder="Message"
      />
      <Image src={MessageIcon} alt="Search Bar" width={17} height={17} className="absolute left-3 top-4" />
      {errors.text && <p className="mt-1 text-xs text-red-500">{errors.text.message}</p>}
    </div>
  );
}
