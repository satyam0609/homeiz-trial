"use client";
import React from "react";
interface Props {
  placeholder?: string;
  onChange?: (text: string) => void;
}

const SearchBox = ({ placeholder, onChange }: Props) => {
  const [active, setActive] = React.useState(false);

  return (
    <input
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      onChange={(e) => onChange && onChange(e.target.value)}
      type="text"
      placeholder={placeholder}
      className={`w-full px-5 py-3 rounded-full  outline-none
             text-sm font-bold text-text-primary
             placeholder:text-gray-600 border ${
               active ? "border-blue-500" : "border-[rgb(230,228,224)]"
             }`}
      style={{
        backgroundColor: "rgb(241, 240, 237)",
      }}
    />
  );
};

export default SearchBox;
