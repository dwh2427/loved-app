import Image from "next/image";
import CloseTextIcon from "@/public/close-text.svg";
import SearchBar from "@/public/search-bar.svg";
import { useEffect, useState } from "react";


export default function SearchInput({
  inputValue,
  setValue,
  watch,
  pages,
  setSelectedPage,
  errors,
  setError
}) {

  const capitalize = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };
  
  const [countryCode, setCountryCode] = useState("");
  const [pageLink, setPageLink] = useState(null);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  // Regular expressions for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usPhoneRegex = /^\(?\+?1\)?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
  const auPhoneRegex = /^\(?\+?61\)?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{4}$/;
  const bdPhoneRegex = /^\(?\+?880\)?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{4}$/;

  // Functions for formatting phone numbers
  const formatUSPhone = (number) => {
    const cleaned = number.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
    }
    return number;
  };

  const formatAUPhone = (number) => {
    const cleaned = number.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
    if (match) {
      return `+61 ${match[1]} ${match[2]} ${match[3]}`;
    }
    return number;
  };

  const formatBDPhone = (number) => {
    const cleaned = number.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
    if (match) {
      return `+880 ${match[1]} ${match[2]} ${match[3]}`;
    }
    return number;
  };

  // Handles changes in the search input field
  const handleChange = (e) => {
    let value = e.target.value;

    // Automatically add country code if the input starts with a number
    const countryCode = watch("countryCode");
    if (/^\d/.test(value) && !value.startsWith(countryCode)) {
      value = countryCode + value;
    }

    setValue("inputValue", value);

    if (value) {
      const valueLowerCase = value.toLowerCase();
      const words = valueLowerCase.split(" ");

      const filtered = pages?.filter((suggestion) => {
        const firstName = suggestion?.first_name?.toLowerCase() || "";
        const lastName = suggestion?.last_name?.toLowerCase() || "";
        const email = suggestion?.email?.toLowerCase() || "";
        const phone = suggestion?.phone?.toLowerCase() || "";

        if (words.length > 1) {
          return words.every(
            (word) =>
              firstName.includes(word) ||
              lastName.includes(word) ||
              email.includes(word) ||
              phone.includes(word)
          );
        } else {
          return (
            firstName.includes(valueLowerCase) ||
            lastName.includes(valueLowerCase) ||
            email.includes(valueLowerCase) ||
            phone.includes(valueLowerCase)
          );
        }
      });

      setFilteredSuggestions(filtered.length > 0 ? filtered : []);
    } else {
      setFilteredSuggestions([]);
    }
  };

  // Validates and formats input values when the user leaves the input field
  const handleBlur = (e) => {
    let value = e.target.value.trim();

    // Check if the value contains '@' for email validation
    if (value.includes("@")) {
      if (!emailRegex.test(value.toLowerCase())) {
        alert("Please enter a valid email address.");
        return;
      }
    } else if (/\d/.test(value)) {
      const isUSPhone = usPhoneRegex.test(value);
      const isAUPhone = auPhoneRegex.test(value);
      const isBDPhone = bdPhoneRegex.test(value);

      if (isUSPhone) {
        value = formatUSPhone(value);
      } else if (isAUPhone) {
        value = formatAUPhone(value);
      } else if (isBDPhone) {
        value = formatBDPhone(value);
      } else {
        alert("Please enter a valid US, Australian, or Bangladeshi phone number.");
        return;
      }
    }

    setValue("inputValue", value);
  };

  // Clears the input field and resets related states
  const handleClear = () => {
    setValue("inputValue", "");
    setValue("pageName", "");
    setValue("pageOwnerId", "");
    setSelectedPage(null);
    setFilteredSuggestions(pages);
    localStorage.removeItem("public_page", "");
  };

  
  // Handles the selection of a suggestion from the filtered list
  const handleClick = (suggestion) => {
    setSelectedPage(suggestion);
    setPageLink(suggestion?.username);
    setValue("inputValue", `${suggestion?.first_name} ${suggestion?.last_name}`);
    setError("inputValue", "");
    setValue("pageName", suggestion?.username);
    setValue("pageOwnerId", suggestion?.uid);
    setFilteredSuggestions([]);
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.get("https://ipinfo.io?token=6d1710dc4afd5f");
        const country = response.data.country;
        if (country === "US") {
          setValue("countryCode", "+1");
        } else if (country === "AU") {
          setValue("countryCode", "+61");
        } else if (country === "BD") {
          setValue("countryCode", "+880");
        } else {
          setValue("countryCode", "+1");
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    fetchLocation();
  }, [setValue]);
  

  return (
    <div className="form-group relative">
      <input
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        autoComplete="new-password"
        className={`w-[330px] bg-[#F1F1F1] p-3 pl-10 focus:outline-none ${
          filteredSuggestions.length > 0
            ? "rounded-t-[25px] rounded-tl-[25px] rounded-tr-[25px]"
            : "rounded-full"
        }`}
        type="text"
        placeholder="Name, mobile phone or email"
      />
      <Image src={SearchBar} alt="Search Bar" width={17} height={17} className="absolute left-3 top-4" />
      {inputValue && (
        <Image
          onClick={handleClear}
          src={CloseTextIcon}
          alt="close"
          width={17}
          height={17}
          className="absolute right-3 top-4 cursor-pointer"
        />
      )}
      {filteredSuggestions.length > 0 && (
            <ul className="absolute left-0 right-0 z-50 border-t border-t-[#A5B5D4] bg-white  shadow-sm ">
              {filteredSuggestions
                .slice(0, 8)
                .map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleClick(suggestion)}
                    className="flex cursor-pointer gap-2 border-b-[0.5px] border-[#A5B5D4] bg-[#F1F1F1] px-2 pb-1 pt-2"
                  >
                    <div className="flex items-center">
                      {suggestion?.images !== undefined &&
                      suggestion?.images.length > 0 ? (
                        <Image
                          src={suggestion?.images[0]}
                          alt="Profile Image"
                          width={30}
                          height={30}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <Image
                          src={PlusIcon}
                          alt="Plus Icon"
                          width={20}
                          height={20}
                        />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[16px] font-medium">
                        {capitalize(suggestion?.first_name)}{" "}
                        {capitalize(suggestion?.last_name)}
                      </p>
                      <span className="text-sm text-[#A5B5D4]">
                        {suggestion?.additional_info?.city}
                        {suggestion?.additional_info?.city && ", "}{" "}
                        {suggestion?.additional_info?.country === "AU"
                          ? "Australia"
                          : suggestion?.additional_info?.country}
                      </span>
                    </div>
                  </li>
                ))}
            </ul>
          )}
      {errors.inputValue && <p className="mt-1 text-xs text-red-500">{errors.inputValue.message}</p>}
    </div>
  );
}
