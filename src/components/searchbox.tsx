import React from "react";
interface Props {
  placeholder?: string;
  onChange?: (text: string) => void;
}

const SearchBox = ({ placeholder, onChange }: Props) => {
  return (
    <input
      onChange={(e) => onChange && onChange(e.target.value)}
      type="text"
      placeholder={placeholder}
      className="w-full px-5 py-3 rounded-full border outline-none
             text-sm font-bold text-text-primary
             placeholder:text-gray-600"
      style={{
        backgroundColor: "rgb(241, 240, 237)",
        borderColor: "rgb(230, 228, 224)",
      }}
    />
  );
};

export default SearchBox;
