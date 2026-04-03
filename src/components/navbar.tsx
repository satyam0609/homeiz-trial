import React, { useEffect, useRef, useState } from "react";
// Using lucide-react for the icons shown in your image
import {
  Newspaper,
  Users,
  Search,
  Home,
  Bookmark,
  Film,
  User,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import UserIcon from "@/assets/icons/profile";

const Navbar = ({ onClose }: { onClose: () => void }) => {
  const path = usePathname();
  const router = useRouter();
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState("home");

  const navItems = [
    {
      id: "home",
      label: "Home news feed",
      icon: <Newspaper strokeWidth={2} size={20} />,
      href: "/",
    },
    {
      id: "community",
      label: "Community news feed",
      icon: <Users strokeWidth={2} size={20} />,
      href: "/community",
    },
    {
      id: "search",
      label: "Real estate search",
      icon: <Search strokeWidth={2} size={20} />,
      href: "/search",
    },
    {
      id: "advertise",
      label: "Advertise a property",
      icon: <Home strokeWidth={2} size={20} />,
      href: "/advertise",
    },
    {
      id: "bookmarks",
      label: "Bookmarks",
      icon: <Bookmark strokeWidth={2} size={20} />,
      href: "/bookmarks",
    },
    {
      id: "vids",
      label: "Vids",
      icon: <Film strokeWidth={2} size={20} />,
      href: "/videos",
    },
    {
      id: "profile",
      label: "Profile",
      icon: <UserIcon size={20} />,
      href: "/profile",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={navbarRef}
      className="flex flex-col px-4 py-6 space-y-2 
             h-[60vdh] overflow-y-auto "
    >
      {navItems.map((item) => {
        const isActive = path === item.href;

        return (
          <button
            key={item.id}
            onClick={() => router.push(item.href)}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 
              ${
                isActive
                  ? "text-blue-600 bg-blue-50 font-semibold"
                  : "text-text-primary hover:bg-gray-100"
              }`}
          >
            <span className={isActive ? "text-blue-600" : "text-text-primary"}>
              {item.icon}
            </span>
            <span className="text-base font-semibold">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Navbar;
