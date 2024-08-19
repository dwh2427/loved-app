import Image from "next/image";
import CloseTextIcon from "@/public/close-text.svg";
import SearchBar from "@/public/search-bar.svg";

export default function SearchInput({
  inputValue,
  handleChange,
  handleBlur,
  handleClear,
  filteredSuggestions,
  handleClick,
  register,
  errors,
}) {
  return (
    <div className="form-group relative">
      <input
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        autoComplete="new-password"
        className={`w-[330px] bg-[#F1F1F1]  p-3 pl-10 focus:outline-none ${
          filteredSuggestions.length > 0
            ? 'rounded-t-[25px] rounded-tl-[25px] rounded-tr-[25px]'
            : 'rounded-full'
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
              {/* Add your logic to render suggestion item */}
            </li>
          ))}
        </ul>
      )}
      {errors.inputValue && (
        <p className="mt-1 text-xs text-red-500">
          {errors.inputValue.message}
        </p>
      )}
    </div>
  );
}
