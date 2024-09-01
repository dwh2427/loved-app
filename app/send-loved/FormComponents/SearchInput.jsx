import Image from "next/image";
import CloseTextIcon from "@/public/close-text.svg";
import SearchBar from "@/public/search-bar.svg";
import { useEffect, useState } from "react";
import PlusIcon from "@/public/plus-rounded.svg";

export default function SearchInput({
  inputValue,
  setValue,
  watch,
  pages,
  setSelectedPage,
  errors,
  setError,
}) {
  const capitalize = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const [pageLink, setPageLink] = useState(null);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  // Regular expressions for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function formatPhoneNumber(value) {
    // Remove all non-digit characters first
    const digits = value.replace(/\D/g, '');
  
    let formattedNumber = '';
  
    // AU format (Australian mobile numbers starting with 04)
    if (/^04/.test(digits)) {
      formattedNumber = digits.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
    }
    // US format (assuming any other format is US)
    else if (/^\d{10}$/.test(digits)) {
      formattedNumber = digits.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
    else {
      formattedNumber = value; // Fallback to the raw number if no pattern matches
    }
  
    return formattedNumber.trim();
  }
  


  // Handles changes in the search input field
  const handleChange = (e) => {
    let value = e.target.value;

    // Format the number based on detected pattern
    if (/\d/.test(value)) {
      value = formatPhoneNumber(value);
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

  // Validates and formats input values on each key press
  const handleKeyUp = (e) => {
    let value = e.target.value.trim();

    if (value.includes("@")) {
      if (!emailRegex.test(value.toLowerCase())) {
        setError("inputValue", { message: "Please enter a valid email address." });
        return;
      } else {
        setError("inputValue", "");
      }
    } else if (/\d/.test(value)) {
      value = formatPhoneNumber(value);
      setError("inputValue", "");
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

  return (
    <div className="form-group relative">
      <input
        value={inputValue || ""}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        autoComplete="new-password"
        className={`w-[330px] bg-[#F1F1F1] p-3 pl-10 focus:outline-none ${
          filteredSuggestions.length > 0
            ? "rounded-t-[25px] rounded-tl-[25px] rounded-tr-[25px]"
            : "rounded-full"
        }`}
        type="text"
        placeholder="Name, mobile phone or email"
      />
      <Image
        src={SearchBar}
        alt="Search Bar"
        width={17}
        height={17}
        className="absolute left-3 top-4"
      />
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
        <ul className="absolute left-0 right-0 z-50 border-t border-t-[#A5B5D4] bg-white shadow-sm">
          {filteredSuggestions.slice(0, 8).map((suggestion, index) => (
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
                  <Image src={PlusIcon} alt="Plus Icon" width={20} height={20} />
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
      {errors.inputValue && (
        <p className="mt-1 text-xs text-red-500">{errors.inputValue.message}</p>
      )}
    </div>
  );
}
