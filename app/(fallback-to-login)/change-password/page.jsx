import ChangePasswordForm from "@/components/form/change-password";

export default function page() {
  return (
    <>
      <div className="mx-auto mt-[66.01px] h-auto w-full max-w-[513px] rounded-[16px] p-16">
        <div className="mx-auto h-[40px] max-w-[316px] whitespace-nowrap text-center text-[40px] font-black leading-[40px]">
          Change Password
        </div>
        <ChangePasswordForm />
      </div>
    </>
  );
}
