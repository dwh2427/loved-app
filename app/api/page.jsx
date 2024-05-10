'use client'
import AnimatedModal from "@/components/ui/popup";
import { useState } from "react";

export default function API() {
    const [open, setOpen] = useState(true)

    return <div>
        <button onClick={() => setOpen(true)}>open</button>
        <AnimatedModal isOpen={open} closeModal={() => setOpen(false)} >asdfsdf</AnimatedModal>
    </div>
}