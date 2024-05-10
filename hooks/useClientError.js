import { toast } from "@/components/ui/use-toast";

// eslint-disable-next-line import/no-anonymous-default-export
export default function () {
  return (error) => {
    console.log(error);
    const errorRes = error?.response?.data;
    if (errorRes) {
      toast({ title: errorRes.message, variant: "destructive" });
    } else toast({ title: error.message, variant: "destructive" });
  };
}
