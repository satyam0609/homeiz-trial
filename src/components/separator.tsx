type SeparatorProps = {
  orientation?: "horizontal" | "vertical";
  label?: string;
  className?: string;
};

const Separator = ({
  orientation = "horizontal",
  label,
  className = "",
}: SeparatorProps) => {
  if (orientation === "vertical") {
    return <div className={`w-px bg-gray-500 mx-2 ${className}`} />;
  }

  return (
    <div className={`flex items-center my-4 ${className}`}>
      <div className="flex-1 h-px bg-gray-500" />
      {label && (
        <span className="px-3 text-sm text-gray-500 whitespace-nowrap">
          {label}
        </span>
      )}
      <div className="flex-1 h-px bg-gray-500" />
    </div>
  );
};

export default Separator;
