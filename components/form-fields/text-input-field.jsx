/* eslint-disable @next/next/no-img-element */

import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
const TextInputField = ({ control, name, label, placeholder, type = 'text', ...other }) => {
    return (
        <div className="mx-auto w-full space-y-41.41px md:mt-16px md:flex md:max-w-385px md:space-y-0">
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem className="mx-auto h-173.06px w-full max-w-689.17px space-y-8px md:h-auto md:w-188px md:space-y-8px">
                        <FormLabel className="h-30px  max-w-160px text-25.88px font-semibold leading-29.12px text-black md:h-18px md:w-75px md:text-12px md:font-bold md:leading-14.4px">
                            {label}
                        </FormLabel>
                        <FormControl >
                            <Input
                                onChange={(selected) => {
                                    field.onChange(selected);
                                    onChange(selected);
                                }}
                                {...other}
                                type={type}
                                
                                placeholder={placeholder}
                                className="mx-auto mt-[8px] h-75% max-h-102.71px w-full rounded-16.18px border-1.94px px-23.3px py-32.36px text-32.36px leading-37.53px text-black placeholder:text-#A2AEBA md:h-44px md:w-188px md:rounded-8px md:border md:p-3 md:text-18px md:leading-20px md:placeholder-h-20px md:placeholder-w-full md:placeholder-text-18px md:placeholder-leading-20px"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage className="whitespace-nowrap" />
                    </FormItem>
                )}
            />
        </div>
    );
};

export default TextInputField;
