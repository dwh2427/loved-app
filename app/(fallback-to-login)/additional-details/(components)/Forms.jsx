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
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import useApiCaller from "@/hooks/useApiCaller";
import useAuthState from "@/hooks/useAuthState";
import useClientError from "@/hooks/useClientError";
import { zodResolver } from "@hookform/resolvers/zod";
import { es } from "date-fns/locale/es";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { useForm } from "react-hook-form";
// "With country select" component.
import countrys from '@/public/countrys.json';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import "react-calendar/dist/Calendar.css";
import "react-date-picker/dist/DatePicker.css";

import { z } from "zod";
registerLocale("es", es);


const formSchema = z.object({
    city: z.string().min(1, {
        message: "City is required",
    }),
    emailAddress: z.string().email({
        message: "Please provide a valid email address",
    }),
    state: z.string().min(1, {
        message: "State is required",
    }),
    postal_code: z.string().min(4, {
        message: "Postal code is required",
    }),
    street_address: z.string().min(1),
});

export default function AdditionalDetailsForm() {
    const [loading, setLoading] = useState("");
    const handleClientError = useClientError();
    const { user } = useAuthState();
    const [country, setCountry] = useState('')
    const router = useRouter();
    const apiCaller = useApiCaller();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date_of_birth: new Date(),
            emailAddress: "",
            city: "",
            street_address: "",
            state: "",
            postal_code: "",
        },
    });

    const [dateErrorMessage, setDateErrorMessage] = useState("");
    const [selectedDates, setSelectedDates] = useState(null);
    const currentDate = new Date();
    const minDate = new Date(
        currentDate.getFullYear() - 13,
        currentDate.getMonth(),
        currentDate.getDate(),
    );

    const handleDateChange = (date) => {
        // Check if the selected date is at least 13 years ago
        if (date <= minDate) {
            setSelectedDates(date);
            setDateErrorMessage("");
        } else {
            setDateErrorMessage("User must be at least 13 years old.");
        }
    };

   // const [selectedCountry, setSelectedCountry] = useState(null);

    const handleSubmit = async () => {
        // if (!selectedCountry) return;
        setLoading(true);
        const pageId = localStorage.getItem("pageId");
        const uniqueId = localStorage.getItem("verifyValue") || "";

        try {
            if (user) {
                const formdata = form.getValues();
                const data = { ...formdata, country, uniqueId:uniqueId, date_of_birth: selectedDates, pageId };
                const res = await apiCaller.post("/api/api/add_additional_details", data);

                // Remove verifyValue from localStorage after successful API call
                localStorage.removeItem("verifyValue");
                const defaultCurrency = countrys.find(i => i.country_code === country)
                localStorage.setItem('defaultCurrency', defaultCurrency?.currency)
                router.push("/add-photo");
            }
        } catch (error) {
            handleClientError(error);
        } finally {
            setLoading(false);
        }
    };

    const {
        placesService,
        placePredictions,
        getPlacePredictions,
        isPlacePredictionsLoading,
    } = usePlacesService({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY,
    });

    const renderItem = (item) => {
        return (
            <button
                type="button"
                onClick={() => handleLocationSearch(item)}
                className="w-full border-b p-2 text-left"
            >
                {item?.description}
            </button>
        );
    };

    const [searchLocation, setSearchLocation] = useState("");
    const [isCloseSearch, setIsCloseSearch] = useState(true);

    const handleLocationSearch = (selectedLocation) => {
        placesService?.getDetails(
            { placeId: selectedLocation.place_id },
            (placeDetails) => {
                const getComponentByType = (type) => {
                    return placeDetails.address_components.find((component) =>
                        component.types.includes(type),
                    );
                };

                // Extract city, state, postal code, and country code
                const cityComponent = getComponentByType("locality");
                const stateComponent = getComponentByType("administrative_area_level_1");
                const postalCodeComponent = getComponentByType("postal_code");
                const countryComponent = getComponentByType("country");

                const city = cityComponent ? cityComponent.long_name : "";
                const state = stateComponent ? stateComponent.long_name : "";
                const postalCode = postalCodeComponent ? postalCodeComponent.long_name : "";
                const country = countryComponent ? countryComponent.short_name : "";

                form.setValue("city", city);
                form.setValue("state", state);
                form.setValue("postal_code", postalCode);
                setCountry(country)
                form.clearErrors();
                setIsCloseSearch(false);
            },
        );

        form.setValue( 
            "street_address",
            selectedLocation?.description.split(",")[0],
        );
        setSearchLocation(selectedLocation?.description.split(",")[0]);
    };



    useEffect(() => {
        getPlacePredictions({ input: searchLocation });
        form.setValue("street_address", searchLocation);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchLocation]);



    const checkFormErrors = () => {
        if (selectedDates === null) {
            setDateErrorMessage("Please select your date of birth");
            return false;
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className=" flex flex-col items-center gap-y-[41.41px] md:gap-y-[0px]"
            >
                <h3 className="mx-auto w-4/5 text-center text-[40px] font-bold leading-[30px] md:mt-[46px] md:w-full md:whitespace-nowrap md:text-[25px]">
                    We need some <br /> additional information
                </h3>

                <div className="mx-auto flex  w-full flex-col gap-[16px]  md:mt-[16px] md:max-w-[385px]">
                    <div className="space-y-41.41px md:mt-16px md:max-w-385px mx-auto w-full md:flex md:space-y-0">
                        <FormField
                            control={form.control}
                            name={"date_of_birth"}
                            render={({ field: { onChange, value } }) => (
                                <FormItem className="h-173.06px max-w-689.17px space-y-8px md:w-188px md:space-y-8px mx-auto flex w-full flex-col md:h-auto">
                                    <FormLabel className="h-30px  max-w-160px text-25.88px leading-29.12px md:h-18px md:w-75px md:text-12px md:leading-14.4px font-semibold text-black md:font-bold">
                                        Date of birth
                                    </FormLabel>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={["DatePicker"]}>
                                            <DatePicker
                                                style={{
                                                    overflow: "hidden",
                                                }}
                                                value={selectedDates}
                                                onChange={handleDateChange}
                                                className="custom-datepickers"
                                                inputClassName="date-custom-input"
                                            />
                                        </DemoContainer>
                                        {dateErrorMessage && (
                                            <p className="w-full max-w-[414px] whitespace-nowrap text-[25.88px] font-semibold leading-[29.12px] text-[#C9534B] md:max-w-full md:text-[12px] md:font-bold md:leading-[14.4px]">
                                                {dateErrorMessage}
                                            </p>
                                        )}
                                    </LocalizationProvider>
                                    <FormMessage className="whitespace-nowrap" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-41.41px md:mt-16px md:max-w-385px mx-auto w-full md:flex md:space-y-0">

                    <FormField
                            control={form.control}
                            name="emailAddress"
                            render={({ field }) => (
                                <FormItem className="h-[173.06px] w-full max-w-[689.17px] space-y-[5.18px] md:mt-[16px] md:h-auto md:w-[385px] md:space-y-[8px]">
                                <FormLabel className="h-[30px] max-w-[160px] text-[25.88px] font-semibold leading-[29.12px] text-black md:h-[18px] md:w-[75px] md:text-[12px] md:font-bold md:leading-[14.4px]">
                                    Email Address
                                </FormLabel>
                                <FormControl>
                                    <Input
                                    // onChange={(e) => validateEmail(e)}
                                    placeholder="@.com"
                                    className="h-[75%] max-h-[102.71px] w-full rounded-[16.18px] border-[1.94px] px-[23.3px] py-[32.36px] text-[32.36px] leading-[37.53px] placeholder:text-black md:h-[44px] md:w-[385px] md:rounded-[8px] md:border md:p-3 md:text-[18px]  md:leading-[20px] md:placeholder:h-[20px] md:placeholder:w-full md:placeholder:text-[18px] md:placeholder:leading-[20px]"
                                    {...field}
                                    />
                                </FormControl>

                                <FormMessage className="whitespace-nowrap" />
                                </FormItem>
                            )}
                            />

                    </div>

                    <div className="space-y-41.41px md:mt-16px md:max-w-385px mx-auto w-full md:flex md:space-y-0">
                        <FormField
                            control={form.control}
                            name={"street_address"}
                            render={({ field }) => (
                                <FormItem className="h-173.06px max-w-689.17px space-y-8px md:w-188px md:space-y-8px mx-auto w-full md:h-auto">
                                    <FormLabel className="h-30px  max-w-160px text-25.88px leading-29.12px md:h-18px md:w-75px md:text-12px md:leading-14.4px font-semibold text-black md:font-bold">
                                        Address
                                    </FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input
                                                placeholder="Enter a place"
                                                value={searchLocation}
                                                className="h-75% max-h-102.71px rounded-16.18px border-1.94px px-23.3px py-32.36px text-32.36px leading-37.53px placeholder:text-#A2AEBA md:h-44px md:w-188px md:rounded-8px md:text-18px md:leading-20px md:placeholder-h-20px md:placeholder-w-full md:placeholder-text-18px md:placeholder-leading-20px mx-auto mt-[8px] w-full text-black md:border md:p-3"
                                                onChange={(evt) => {
                                                    setSearchLocation(evt.target.value),
                                                        setIsCloseSearch(true);
                                                }}
                                                loading={isPlacePredictionsLoading}
                                            />

                                            {placePredictions.length > 0 && isCloseSearch && (
                                                <div className="flex flex-col rounded border">
                                                    {placePredictions?.map((item) => renderItem(item))}
                                                </div>
                                            )}
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
                        placeholder="Enter city"
                    />

                    <div className="flex gap-[16px]">
                        <TextInputField
                            control={form.control}
                            name="state"
                            label="State"
                            placeholder="Enter state"
                        />
                        <TextInputField
                            control={form.control}
                            name="postal_code"
                            label="Postal Code"
                            type="text"
                            placeholder="Enter postal code"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant={"default"}
                    disabled={loading}
                    onClick={checkFormErrors}
                    className="mx-auto h-[102.71px] w-full max-w-[625.75px] rounded-[64.71px] bg-[#FF007A] px-[51.77px] py-[32.36px] text-center text-[32.36px] font-black leading-[37.53px] text-[#FEFFF8] hover:bg-[#FF007A] focus:bg-[#FF007A] focus-visible:ring-0 focus-visible:ring-[#FF007A] focus-visible:ring-offset-0 dark:bg-violet-600 dark:text-gray-50 md:mt-[86px] md:h-[62px] md:w-[384px] md:rounded-[100px] md:px-[25px] md:py-[20px] md:text-center md:text-[18px] md:font-black md:leading-[22px]"
                >
                    {loading && <Loader2 className="mr-2 size-6 animate-spin" />}
                    Continue
                </Button>
            </form>
        </Form>
    );
}
