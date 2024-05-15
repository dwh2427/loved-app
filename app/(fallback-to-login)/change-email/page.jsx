import ChangeEmailForm from "@/components/form/change-email";

export default function page() {
  return (
    <>
      <div className="mx-auto mt-[66.01px] max-h-[458px] w-full max-w-[513px] rounded-[16px] p-16">
        <div className="mx-auto h-[40px] max-w-[241px] whitespace-nowrap text-center text-[40px] font-black leading-[40px]">
          Change Email
        </div>
        <ChangeEmailForm />
      </div>
    </>
  );
}
