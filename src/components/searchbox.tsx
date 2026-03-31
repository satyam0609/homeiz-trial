"use client";
import { SearchIcon } from "lucide-react";
import React from "react";
interface Props {
  placeholder?: string;
  onChange?: (text: string) => void;
  classname?: string;
  showSearch?: boolean;
}

const SearchBox = ({
  placeholder,
  onChange,
  classname,
  showSearch = false,
}: Props) => {
  const [active, setActive] = React.useState(false);

  return (
    <div className="relative">
      <input
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        onChange={(e) => onChange && onChange(e.target.value)}
        type="text"
        placeholder={placeholder}
        className={`w-full px-5 py-3 rounded-full  outline-none
             text-base font-bold text-text-primary
             placeholder:text-gray-600 border ${
               active ? "border-blue-500" : "border-[rgb(230,228,224)]"
             } pr-10 ${classname}`}
        style={{
          backgroundColor: "#ebebeb",
        }}
      />
      {showSearch && <SearchIcon className="absolute right-4 top-2" />}
    </div>
  );
};

export default SearchBox;
