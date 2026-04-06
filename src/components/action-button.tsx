import React from "react";

type Props = {
  icon?: React.ElementType;
  count: string;
  onClick?: () => void;
  className?: string;
  customIcon?: React.ReactNode;
};

const ActionButton = ({
  icon: Icon,
  count,
  onClick,
  className = "",
  customIcon,
}: Props) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1 px-2 py-1 rounded-md transition-all
        hover:bg-gray-100 hover:text-blue-600 
        active:scale-95
        ${className}
      `}
    >
      {customIcon ? customIcon : Icon && <Icon size={22} />}
      <span className="text-base font-semibold">{count}</span>
    </button>
  );
};

export default ActionButton;
