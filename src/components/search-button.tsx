"use client";
import React from "react";
import { SearchIcon } from "lucide-react";

interface Props {
  label: string;
  onClick?: () => void;
  className?: string;
  showIcon?: boolean;
}

const SearchButton = ({
  label,
  onClick,
  className,
  showIcon = false,
}: Props) => {
  const [active, setActive] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      onMouseLeave={() => setActive(false)}
      className={`w-full px-5 py-3 rounded-full flex items-center justify-between
        text-base font-bold text-text-primary
        border transition-all duration-150
        ${active ? "border-blue-500" : "border-[rgb(230,228,224)]"}
        ${className}`}
      style={{
        backgroundColor: "#ebebeb",
      }}
    >
      <span className="text-lg">{label}</span>

      {showIcon && <SearchIcon size={18} />}
    </button>
  );
};

export default SearchButton;
