import React, { useState } from "react";
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

const Navbar = () => {
  const path = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("home");

  const navItems = [
    {
      id: "home",
      label: "Home news feed",
      icon: <Newspaper size={20} />,
      href: "/",
    },
    {
      id: "community",
      label: "Community news feed",
      icon: <Users size={20} />,
      href: "/community",
    },
    {
      id: "search",
      label: "Real estate search",
      icon: <Search size={20} />,
      href: "/search",
    },
    {
      id: "advertise",
      label: "Advertise a property",
      icon: <Home size={20} />,
      href: "/advertise",
    },
    {
      id: "bookmarks",
      label: "Bookmarks",
      icon: <Bookmark size={20} />,
      href: "/bookmarks",
    },
    {
      id: "vids",
      label: "Vids",
      icon: <Film size={20} />,
      href: "/videos",
    },
    {
      id: "profile",
      label: "Profile",
      icon: <User size={20} />,
      href: "/profile",
    },
  ];

  return (
    <div className="flex flex-col p-4 space-y-2 ">
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
                  : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <span className={isActive ? "text-blue-600" : "text-gray-500"}>
              {item.icon}
            </span>
            <span className="text-sm">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Navbar;
