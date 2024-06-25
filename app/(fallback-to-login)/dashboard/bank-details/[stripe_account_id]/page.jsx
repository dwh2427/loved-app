import BankDetailsForm from "../(component)/bankDetailsForm";
// href="/dashboard/withdraw"
export default function BankDetails({ params }) {
    return (
        <div className="mx-auto mt-6 flex flex-col justify-center items-center gap-[32px] md:mt-[99px] h-fit w-full max-w-[821px] px-[20px] md:w-[821px] md:px-0 mb-[104px]">
            <div className="flex flex-col justify-center items-center">
                <h2 className='text-3xl font-semibold pb-2'>Verify Your Bank details</h2>
            </div>
            <BankDetailsForm params={params} />
        </div>
    )
}