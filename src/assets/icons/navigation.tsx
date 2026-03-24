import React from "react";

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
};

const NavigationArrowIcon: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  className = "",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <polyline
        points="21.5 2.5 2.5 10.2 9.6 14.4 13.8 21.5 21.5 2.5"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default NavigationArrowIcon;
