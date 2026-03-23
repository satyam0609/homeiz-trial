import React from "react";

type AvatarProps = {
  src?: string;
  alt?: string;
  name?: string; // for fallback initials
  size?: "sm" | "md" | "lg" | number; // number = px
  className?: string;
  online?: "online" | "offline";
};

const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
};

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "avatar",
  name = "",
  size = "md",
  className = "",
  online,
}) => {
  const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.split(" ");
    return parts
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const sizeClass = typeof size === "number" ? "" : sizeMap[size] || sizeMap.md;

  const customSize =
    typeof size === "number" ? { width: size, height: size } : {};

  return (
    <div className="relative">
      <div
        className={`flex items-center justify-center rounded-full overflow-hidden bg-gray-200 text-gray-700 font-medium ${sizeClass} ${className}`}
        style={customSize}
      >
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {online && (
        <div
          className={`h-4 w-4 absolute rounded-full bottom-0 right-0 z-30 border-2 border-white ${
            online === "online" ? "bg-green-500" : "bg-red-500"
          }`}
        />
      )}
    </div>
  );
};

export default Avatar;
