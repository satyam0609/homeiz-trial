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
    return <div className={`w-0.5 bg-text-primary mx-2 ${className}`} />;
  }

  return (
    <div className={`flex items-center my-4 ${className}`}>
      <div className="flex-1 h-1 bg-text-primary" />
      {label && (
        <span className="px-3 text-sm text-text-primary whitespace-nowrap">
          {label}
        </span>
      )}
      <div className="flex-1 h-1 bg-text-primary" />
    </div>
  );
};

export default Separator;
