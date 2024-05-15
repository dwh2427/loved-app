"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export default function EditCustomPageLink({ value, handleSubmit, isUpdating }) {
    const [newValue, setNewValue] = useState(value);
    useEffect(() => { setNewValue(value) }, [value])

    return (
        <>
            <Dialog tabIndex="-1">
                <DialogTrigger tabIndex="-1">
                    <span className="text-[12px] font-[700] leading-[14.4px] text-[#FE5487] cursor-pointer">edit</span>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[434px]">
                    <DialogHeader tabIndex="-1">
                        <DialogTitle className="mb-[32px] text-[25px] font-bold leading-[30px] text-[#650031]">
                            Edit Custom Page Link
                        </DialogTitle>
                    </DialogHeader>
                    <div className="h-[35px] w-full border-b border-[#E9E9E9] mb-[32px]">
                        <Input
                            value={newValue}
                            className="rounded-[8px] p-[12px] font-[700] leading-[22px] text-[18px]"
                            onChange={(e) => setNewValue(e.target.value)}
                        />
                        <p className="font-[700] text-[12px] leading-[14.4px] mt-[8px]">This page link is taken</p>
                    </div>
                    <Button
                        onClick={() => handleSubmit(newValue)}
                        // variant={"default"}
                        disabled={isUpdating}
                        className={`mx-auto mt-[32px] disabled:opacity-50 py-[20px] px-[25px] bg-[#FF007A] hover:bg-[#FF007A] w-full`}
                    >
                        Save Custom Page Link
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
}
