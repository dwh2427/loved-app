import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../ui/form";

const SelectInputField = ({ control, name, label, options, onChange, form, defaultValue = '' }) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="h-[173.06px] w-full max-w-[689.17px] space-y-[5.18px] md:mt-[16px] md:h-auto md:w-[385px] md:space-y-[8px]">
          <FormLabel className="h-[30px] max-w-[160px] text-[25.88px] font-semibold leading-[29.12px] text-black md:h-[18px] md:w-[75px] md:text-[12px] md:font-bold md:leading-[14.4px]">
            {label}
          </FormLabel>
          <Select
            onValueChange={(selected) => {
              field.onChange(selected);
              onChange(selected);
            }}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className="justify-start gap-x-1 text-[18px] font-normal leading-[20px]">
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-[200px]">
              {options.map((option, ind) => (
                <SelectItem key={ind} value={option.value} >
                  <span className="flex gap-1 items-center">{option.icon && <Image className="rounded-[2px]" src={`https:${option.icon}`} alt="" width={15} height={10} />}{option.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default SelectInputField;


