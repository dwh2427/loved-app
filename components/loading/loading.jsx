import { Lobster } from "next/font/google";

import { cn } from "@/lib/utils";
const lobster = Lobster({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

export default function Loading() {
  return (
    <div
      className={cn(
        "grid h-screen w-screen place-items-center text-7xl",
        lobster.className,
      )}
    >
      Loading...
    </div>
  );
}
