import Picture2 from "@/public/image2.svg";
import Image from "next/image";

export default function Sidebar() {
  return (
    <aside className="hidden w-[550px] bg-[#ECFEFF] px-[10px] pb-[120px] pt-[127px] lg:block">
      <div className="mx-auto h-[708px] w-[404px]">
        <h2 className="h-[120px] w-full scroll-m-20 text-center text-[40px] font-black leading-[40px]">
          Your one of the thousands of members who have
        </h2>
        <div className="mx-auto mt-[64px] h-[122px] w-[337px]">
          <div className="relative mx-auto size-[52px]">
            <Image
              src={Picture2}
              alt=""
              className="object-cover"
              fill
              sizes="100vw"
            />
          </div>
          <h3 className="mt-[10px] h-[30px] w-full scroll-m-20 text-center text-[25px] font-bold leading-[30px]">
            Completed 1.5K Projects
          </h3>
          <p className="mx-auto mt-[10px] h-[20px] w-[292px] text-center text-[18px] leading-[20px]">
            You&apos;re busy we know that
          </p>
        </div>
        <div className="mx-auto mt-[64px] h-[122px] w-[337px]">
          <div className="relative mx-auto size-[52px]">
            <Image
              src={Picture2}
              alt=""
              className="object-cover"
              fill
              sizes="100vw"
            />
          </div>
          <h3 className="mt-[10px] h-[30px] w-full scroll-m-20 text-center text-[25px] font-bold leading-[30px]">
            Saved 6K hours of their lives
          </h3>
          <p className="mx-auto mt-[10px] h-[20px] w-[292px] text-center text-[18px] leading-[20px]">
            You’re busy we know that.
          </p>
        </div>
        <div className="mx-auto mt-[64px] h-[122px] w-[337px]">
          <div className="relative mx-auto size-[52px]">
            <Image
              src={Picture2}
              alt=""
              className="object-cover"
              fill
              sizes="100vw"
            />
          </div>
          <h3 className="mt-[10px] h-[60px] w-full scroll-m-20 text-center text-[25px] font-bold leading-[30px]">
            Have added $10M to their homes property values
          </h3>
          <p className="mx-auto mt-[10px] h-[20px] w-[292px] text-center text-[18px] leading-[20px]">
            You’re busy we know that.
          </p>
        </div>
      </div>
    </aside>
  );
}
