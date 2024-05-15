/* eslint-disable @next/next/no-img-element */
"use client";
import TextInputField from "@/components/form-fields/text-input-field";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import useApiCaller from "@/hooks/useApiCaller";
import useAuthState from "@/hooks/useAuthState";
import useClientError from "@/hooks/useClientError";
import { useGetCountryByCountryCode } from "@/hooks/useGetCountry";
import { zodResolver } from "@hookform/resolvers/zod";
import { es } from 'date-fns/locale/es';
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
// "With country select" component.
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import "react-phone-number-input/style.css";

import { z } from "zod";
registerLocale('es', es)
const validateDate = (date) => {
    // Get the year, month, and day from the Date object
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Month is zero-based, so add 1
    const day = date.getDate();

    // Check if year is within 4 digits
    if (year < 1000 || year > 9999) return false;

    // Check if month is within the range of 1-12
    if (month < 1 || month > 12) return false;

    // Check if day is within the range of 1-31
    if (day < 1 || day > 31) return false;


    // Additional checks for specific months (e.g., February)
    // Add more specific checks if needed

    return true; // Date is valid
};


const formSchema = z.object({
    date_of_birth: z.date().refine((dateStr) => validateDate(dateStr), {
        message: "Invalid date format or out of range",
    }).refine((dob) => {
        const today = new Date();
        const dobDate = new Date(dob);
        const age = today.getFullYear() - dobDate.getFullYear();
        const monthDiff = today.getMonth() - dobDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
            return age - 1;
        }
        return age;
    }, {
        message: 'User must be at least 13 years old',
    }),

    city: z.string().min(1, {
        message: "City is required",
    }),
    state: z.string().min(1, {
        message: "State is required",
    }),
    postal_code: z.string().min(4, {
        message: "Postal code is required",
    }),
    phone: z.string(),
    street_address: z.string().min(1),
});

export default function AdditionalDetailsForm() {
    const [loading, setLoading] = useState("");
    const handleClientError = useClientError()
    const { user } = useAuthState()
    const router = useRouter();
    const apiCaller = useApiCaller()
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date_of_birth: new Date(),
            city: "",
            street_address: "",
            state: "",
            postal_code: "",
            phone: "",
        },
    });


    const { country, isLoading } = useGetCountryByCountryCode()
    const [selectedCountry, setSelectedCountry] = useState(null)
    const handleSubmit = async () => {

        if (!selectedCountry) return
        if (!isValidPhoneNumber(form.getValues().phone, selectedCountry?.iso2.toUpperCase())) { return form.setError('phone', { type: 'custom', message: 'Invalid phone format' }); }
        setLoading(true);
        const pageId = localStorage.getItem('pageId')
        try {
            if (user) {
                const formdata = form.getValues()
                const data = { ...formdata, pageId }
                const res = await apiCaller.post('/api/api/stripe', data)
                router.push('/add-photo')

            }
        } catch (error) {
            handleClientError(error)
        } finally { setLoading(false) }

    }

    const {
        placesService,
        placePredictions,
        getPlacePredictions,
        isPlacePredictionsLoading,
    } = usePlacesService({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY,
    });

    const renderItem = (item) => {
        return <button type="button" onClick={() => handleLocationSearch(item)} className="border-b p-2">
            {item?.description}
        </button>
    }

    // useEffect(() => {
    //     setSaveDetails(placePredictions)
    // }, [placesService])
    const [searchLocation, setSearchLocation] = useState('')
    const [isCloseSearch, setIsCloseSearch] = useState(true)
    
    const handleLocationSearch = (selectedLocation) => {
        placesService?.getDetails({ placeId: selectedLocation.place_id }, (placeDetails) => {
            const getComponentByType = (type) => {
                return placeDetails.address_components.find(component => component.types.includes(type));
            };
            // Extract city, state, postal code, and country code
            const cityComponent = getComponentByType('locality');
            const stateComponent = getComponentByType('administrative_area_level_1');
            const postalCodeComponent = getComponentByType('postal_code');
            // const countryComponent = getComponentByType('country');

            const city = cityComponent ? cityComponent.long_name : '';
            const state = stateComponent ? stateComponent.long_name : '';
            const postalCode = postalCodeComponent ? postalCodeComponent.long_name : '';

            form.setValue('city', city)
            form.setValue('state', state)
            form.setValue('postal_code', postalCode)
            form.clearErrors()
            setIsCloseSearch(false)
        })
        form.setValue('street_address', selectedLocation?.description.split(',')[0])
        setSearchLocation(selectedLocation?.description.split(',')[0])
    }



    useEffect(() => {
        getPlacePredictions({ input: searchLocation });
        form.setValue('street_address', searchLocation)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchLocation])


    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="mt-[41.41px] flex flex-col items-center gap-y-[41.41px] md:gap-y-[0px]"
            >

                <h3 className="mx-auto mt-[41.41px] w-4/5 text-center text-[40px] font-bold leading-[30px] md:mt-[46px] md:w-full md:whitespace-nowrap md:text-[25px]">
                    We need some <br /> additional information
                </h3>

                <div className="mx-auto w-full  md:mt-[16px] flex flex-col  md:max-w-[385px] gap-[16px]">
                    <div className="mx-auto w-full space-y-41.41px md:mt-16px md:flex md:max-w-385px md:space-y-0">
                        <FormField
                            control={form.control}
                            name={'date_of_birth'}
                            render={({ field: { onChange, value } }) => (
                                <FormItem className="mx-auto flex flex-col h-173.06px w-full max-w-689.17px space-y-8px md:h-auto md:w-188px md:space-y-8px">
                                    <FormLabel className="h-30px  max-w-160px text-25.88px font-semibold leading-29.12px text-black md:h-18px md:w-75px md:text-12px md:font-bold md:leading-14.4px">
                                        Date of birth
                                    </FormLabel>
                                    <FormControl >
                                        <ReactDatePicker
                                            className="border rounded block px-4 py-2 w-full mt-[8px]"
                                            selected={value} onChange={onChange}
                                        />

                                    </FormControl>
                                    <FormMessage className="whitespace-nowrap" />
                                </FormItem>
                            )}
                        />
                    </div>





                    <div className="mx-auto w-full space-y-41.41px md:mt-16px md:flex md:max-w-385px md:space-y-0">
                        <FormField
                            control={form.control}
                            rules={{
                                validate: (value) => isValidPhoneNumber(value)
                            }}
                            name={'phone'}
                            render={({ field: { ref, ...field } }) => (
                                <FormItem className="mx-auto h-173.06px w-full max-w-689.17px space-y-8px md:h-auto md:w-188px md:space-y-8px">
                                    <FormLabel className="h-30px  max-w-160px text-25.88px font-semibold leading-29.12px text-black md:h-18px md:w-75px md:text-12px md:font-bold md:leading-14.4px">
                                        Phone
                                    </FormLabel>
                                    <FormControl >
                                        <PhoneInput
                                            country={country?.country_code.toLowerCase()}
                                            isValid={(value, country) => {
                                                setSelectedCountry(country)
                                            }}
                                            // focusInputOnCountrySelection={true}
                                            style={{ borderRadius: '5px' }}
                                            className=" w-full phone-input-custom rounded  mt-[8px]"
                                            placeholder={'Enter phone'}
                                            inputStyle={{ width: '100%', height: '40px' }}
                                            {...field}
                                            inputExtraProps={{
                                                ref,
                                                required: true,
                                                autoFocus: true
                                            }}
                                        />

                                        {/* <PhoneInput
                                            onChange={onChange}
                                            value={value}
                                            defaultCountry={country?.country_code}
                                            focusInputOnCountrySelection={true}
                                            style={{ borderRadius: '5px' }}
                                            className="border rounded px-4 py-2 mt-[8px]"
                                            id="phone"
                                            placeholder={'Enter phone'}
                                        /> */}
                                    </FormControl>
                                    <FormMessage className="whitespace-nowrap" />
                                </FormItem>
                            )}
                        />
                    </div>


                    <div className="mx-auto w-full space-y-41.41px md:mt-16px md:flex md:max-w-385px md:space-y-0">
                        <FormField
                            control={form.control}
                            name={'street_address'}
                            render={({ field }) => (
                                <FormItem className="mx-auto h-173.06px w-full max-w-689.17px space-y-8px md:h-auto md:w-188px md:space-y-8px">
                                    <FormLabel className="h-30px  max-w-160px text-25.88px font-semibold leading-29.12px text-black md:h-18px md:w-75px md:text-12px md:font-bold md:leading-14.4px">
                                        Address
                                    </FormLabel>
                                    <FormControl >
                                        <div>
                                            <Input
                                                placeholder="Enter a place"
                                                value={searchLocation}
                                                className="mx-auto mt-[8px] h-75% max-h-102.71px w-full rounded-16.18px border-1.94px px-23.3px py-32.36px text-32.36px leading-37.53px text-black placeholder:text-#A2AEBA md:h-44px md:w-188px md:rounded-8px md:border md:p-3 md:text-18px md:leading-20px md:placeholder-h-20px md:placeholder-w-full md:placeholder-text-18px md:placeholder-leading-20px"
                                                onChange={(evt) => { setSearchLocation(evt.target.value), setIsCloseSearch(true) }}
                                                loading={isPlacePredictionsLoading}

                                            />

                                            {placePredictions.length > 0 && isCloseSearch && <div className="border rounded">
                                                {placePredictions?.map((item) => renderItem(item))}
                                            </div>}
                                        </div>
                                    </FormControl>
                                    <FormMessage className="whitespace-nowrap" />
                                </FormItem>
                            )}
                        />
                    </div>




                    <TextInputField
                        control={form.control}
                        name="city"
                        label="City"
                        placeholder="Enter city" />

                    <div className="flex gap-[16px]">
                        <TextInputField
                            control={form.control}
                            name="state"
                            label="State"
                            placeholder="Enter state" />
                        <TextInputField
                            control={form.control}
                            name="postal_code"
                            label="Postal Code"
                            type="number"
                            placeholder="Enter postal code" />
                    </div>
                </div>





                {/* Submit Button */}
                <Button
                    type="submit"
                    variant={"default"}
                    disabled={loading}
                    className="mx-auto h-[102.71px] w-full max-w-[625.75px] rounded-[64.71px] bg-[#FF007A] px-[51.77px] py-[32.36px] text-center text-[32.36px] font-black leading-[37.53px] text-[#FEFFF8] hover:bg-[#FF007A] focus:bg-[#FF007A] focus-visible:ring-0 focus-visible:ring-[#FF007A] focus-visible:ring-offset-0 dark:bg-violet-600 dark:text-gray-50 md:mt-[86px] md:h-[62px] md:w-[384px] md:rounded-[100px] md:px-[25px] md:py-[20px] md:text-center md:text-[18px] md:font-black md:leading-[22px]"
                >
                    {loading && <Loader2 className="mr-2 size-6 animate-spin" />}
                    Continue
                </Button>
            </form>
        </Form >
    );
}
